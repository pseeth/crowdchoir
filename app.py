import web
import os
import mturk

render = web.template.render('templates/')
db = web.database(dbn='postgres', db='crowdchoir', user='postgres', pw='password')

urls = (
    	'/', 'home',
	'/request', 'request',
	'/contribute/(.*)', 'contribute',
	'/upload', 'upload',
	'/createRequest', 'createRequest',
	'/requests/(.*)', 'requests',
	'/contributions/(.*)', 'contributions'
)

app = web.application(urls, globals())

class home:
    def GET(self):
		#some sort of home page describing the project if we get this far. not really necessary.
        return render.home()

class request:
	def GET(self):
		#here's the code for requesting a hit. it goes to the "request.html" in the templates folder. make an upload audio file page there. when you upload a file, it makes an ajax request to "createRequest" (see below). on success it takes you to the page where you wait for results to come in and download.
		return render.request()

class contribute:
	def GET(self, requestid):
		#okay here's where someone can actually sing along to something. it renders a page with a record interface, and the loaded audio file will be in the folder requests/[requestid].wav. to sing along to a specific requestid, you'd visit /contribute/[requestid].
		rid = dict(requestid=requestid)
		req = db.select('requests', rid, where = "requestid = $requestid")
		return render.contribute(req[0].filename, requestid)

class upload:
	def POST(self):
		#this gets hit by "contribute.html" in the templates folder. once the user has sung something, it gets put into the folder "contributions" at "contributions/[requestid].wav".
		x = web.input(myfile={})
		web.debug(x.keys())
		filedir = '/contributions'
		filepath = x['fname'].replace('\\', '/')
		filename = filepath.split('/')[-1]
		fout = open(filedir + '/' + filename, 'w')
		fout.write(x['audio'])
		fout.close()
		db.insert('contributions', contributeid = x['contributeid'], filename = filedir + '/' + filename, requestid = x['requestid'], projectid = x['projectid'])

class createRequest:
	def POST(self):
		#here's where a request is actually made to amazon mechanical turk. the user will end up going to '/contribute/[requestid]' to record something. the contribute and upload code is above.
		x = web.input(myfile={})
		print x['requestid']
		
		#place file into requests folder. contribute will get at this later for the sing-along step.
		filedir = 'requests'
		filepath = x['fname'].replace('\\', '/')
		filename = filepath.split('/')[-1]
		fout = open(filedir + '/' + filename, 'w')
		fout.write(x['audio'])
		fout.close()

		q = db.insert('requests', requestid = x['requestid'], filename = filedir + '/' + filename, projectid = x['projectid'])

		#sitename is a dummy thing
		sitename = "http://54.187.211.110:8080"
		link = sitename + "/contribute/"
		link += x['requestid']
		mturk.postHIT(link)

class requests:
	def GET(self, name):
		#bit of code to serve up audio in the requests folder
		ext = name.split(".")[-1]
		cType = {
			"wav": "audio/wav"
		}

		if name in os.listdir('requests'):
			web.header("Content-Type", cType[ext])
			return open('requests/%s' % name, "rb").read()
		else:
			raise web.notfound()

class contributions:
	def GET(self, name):
		#bit of code to serve up audio in the contributions folder
		ext = name.split(".")[-1]
		cType = {
			"wav": "audio/wav"
		}

		if name in os.listdir('requests'):
			web.header("Content-Type", cType[ext])
			return open('contributions/%s' % name, "rb").read()
		else:
			raise web.notfound()

if __name__ == "__main__":
    app.run()
