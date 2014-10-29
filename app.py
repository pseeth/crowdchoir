import web
import mturk

render = web.template.render('templates/')
db = web.database(dbn='postgres', db='shout', user='postgres', pw='password')

urls = (
    	'/', 'shout',
	'/request', 'request',
	'/contribute/(.*)', 'contribute',
	'/upload', 'upload',
	'/createRequest', 'createRequest'
)

app = web.application(urls, globals())

class shout:
    def GET(self):
        return render.shout()

class request:
	def GET(self):
		return render.request()

class contribute:
	def GET(self, requestid):
		rid = dict(requestid=requestid)
		req = db.select('requests', rid, where = "request_id = $requestid")
		return render.contribute(req[0].text, requestid)

class upload:
	def POST(self):
		x = web.input(myfile={})
		web.debug(x.keys())
		filedir = 'savedaudio'
		filepath = x['fname'].replace('\\', '/')
		filename = filepath.split('/')[-1]
		fout = open(filedir + '/' + filename, 'w')
		fout.write(x['audio'])
		fout.close()
		db.insert('contributions', contributeid = x['contributeid'], filename = filedir + '/' + filename, text = x['text'], request_id = x['requestid'])

class createRequest:
	def POST(self):
		x = web.input(myfile={})
		print x['requestid']
		q = db.insert('requests', request_id = x['requestid'], text = x['string'])
		link = "http://54.69.164.187:8080/contribute/"
		link += x['requestid']
		mturk.postHIT(link)
		

if __name__ == "__main__":
    app.run()
