CrowdChoir
---------

Process:
----------
Our process starts with one person uploading an audio track of the melody they want others to sing to Mechanical Turk through a browser interface. We take the melody and post HITs to Mechanical Turk, asking the worker in each HIT to sing along to the melody. The uploader of the original audio track determines how many voices he wants on the end track, so he determines how many HITs are posted. We take all of the workers’ results from our HITs and compile them together into one audio file, and feed the results back to the uploader’s interface.

Tech:
---------

* using [web.py]
* Audio using [WebAudioApi]
* Posting Hits to [Amazon mTurk]


[web.py]:http://webpy.org/
[WebAudioApi]:https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
[Amazon mTurk]:https://www.mturk.com/mturk/welcome

Project by Prem, Zak, Kevin, Frank, and Jon