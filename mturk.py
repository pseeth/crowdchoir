from boto.mturk.connection import MTurkConnection
from boto.mturk.question import QuestionContent, Question, Question, QuestionForm, Overview, AnswerSpecification, FormattedContent, FreeTextAnswer
from secretkeys import *

HOST = 'mechanicalturk.amazonaws.com'

mtc = MTurkConnection(aws_access_key_id = ACCESS_ID,
                      aws_secret_access_key=SECRET_KEY,
                      host=HOST)

# print mtc.get_account_balance()
def postHIT(link):
	title = 'Sing along to an audio file!'

	description = ('Quick, easy, and fun task. Go to the link below read and record sentences shown on the webpage. Copy the given survey code here.')

	keywords = 'recording, english, tesing'

	overview = Overview()
	overview.append_field('Title', title)
	overview.append(FormattedContent('<a href="' + link + '"> Click this link to go to the task</a>'))

	# qc1 = QuestionContent()
	# qc1.append_field('Title', 'Which city are you from?')
	# fta1 = FreeTextAnswer(default="", num_lines=1)
	# q1 = Question(identifier='pronunciation',
	#                     content = qc1,
	#                     answer_spec=AnswerSpecification(fta1),
	#                     is_required = False)

	qc2 = QuestionContent()
	qc2.append_field('Title', 'Put your survey code here')
	fta2 = FreeTextAnswer(default="", num_lines=1)
	q2 = Question(identifier='pronunciation',
			    content = qc2,
			    answer_spec=AnswerSpecification(fta2),
			    is_required = False)

	question_form = QuestionForm()
	question_form.append(overview)
	# question_form.append(q1)
	question_form.append(q2)

	mtc.create_hit(questions = question_form,
		       max_assignments = 1,
		       title = title,
		       description = description,
		       keywords = keywords,
		       duration = 60*60*6,
		       reward = 0.03)
