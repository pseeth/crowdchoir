CREATE DATABASE crowdchoir;
\c crowdchoir;
CREATE TABLE requests (
	requestid text,
	filename text,
	projectid text,
	origname text
);
CREATE TABLE contributions (
	contributeid text,
	filename text,
	requestid text,
	projectid text
);
