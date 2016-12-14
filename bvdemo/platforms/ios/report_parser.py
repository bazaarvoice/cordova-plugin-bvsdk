#!/usr/bin/env python2.7
import json
import csv
import boto3
import datetime
from pprint import pprint

with open('cucumber.json') as data_file:    
    data = json.load(data_file)

current_date = datetime.datetime.now()
passed = 0
failed = 0
skipped = 0
failedMessage = ''
for data_set in data:
	for element in data_set['elements']:
		print element['id']
		for before in element['before']:
			if before['result']['status'] == 'passed':
				passed = passed + 1
				print '    result duration: ' + str(before['result']['duration'])
			elif element['before']['result']['status'] == 'failed':
				failed = failed + 1
				print '    result duration: ' + str(before['result']['duration'])
			print '    result status: ' + before['result']['status']

		for after in element['after']:
			if after['result']['status'] == 'passed':
				passed = passed + 1
				print '    result duration: ' + str(after['result']['duration'])
			elif after['result']['status'] == 'failed':
				failed = failed + 1
				print '    result duration: ' + str(after['result']['duration'])
			print '    result status: ' + after['result']['status']

		for step in element['steps']:
			print '  keyword: ' + step['keyword']
			print '  name: ' + step['name']
			if step['result']['status'] == 'passed':
				passed = passed + 1
				print '    result duration: ' + str(step['result']['duration'])
			elif step['result']['status'] == 'failed':
				failed = failed + 1
				print '    result duration: ' + str(step['result']['duration'])
			else:
				skipped = skipped + 1
			print '    result status: ' + step['result']['status']

			

print 'Time: ' + str(current_date)
print 'Total tests passed: ' + str(passed)
print 'Total tests failed: ' + str(failed)
print 'Total tests skipped: ' + str(skipped)


arrayofdata=[current_date.strftime("%Y-%m-%d"), passed, failed, skipped]
#arrayofdata=['Time', 'Passed', 'Failed', 'Skipped']
s3 = boto3.client(
	's3'
)
with open('cucumber.csv', 'wb') as data:
    s3.download_fileobj('nexus-public-artifacts', 'test-reporting/shopper-tests/iOS/cucumber.csv', data)
    wr = csv.writer(data, dialect='excel')
    wr.writerow(arrayofdata)
with open('cucumber.csv', 'rb') as data:
    s3.upload_fileobj(data, 'nexus-public-artifacts', 'test-reporting/shopper-tests/iOS/cucumber.csv')
with open('cucumber.json', 'rb') as data:
    s3.upload_fileobj(data, 'nexus-public-artifacts', 'test-reporting/shopper-tests/iOS/cucumber.json')
