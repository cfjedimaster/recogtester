Recog Tester
===

A simple utility that lets you compare the results from multiple image recognition APIs. Currently supports IBM Watson, Google, Microsoft, and Amazon.

To test, you need the proper authentication information for each of the supported services. Use creds.json for this. The "form" of this file is:

	{
		"google": { contents of JSON file },
		"ibm": {
			"api_key":"..."
		},
		"microsoft": {
			"url":"...",
			"key":"..."
		}, 
		"amazon":{
			"accessKeyId": "...",
			"secretAccessKey": "...",
			"region":"us-west-2 (or whereever)"
		}
	}

You can find a sample of the output here: [samplereport.pdf](./samplereport.pdf)

History
===

1/21/2019: Updated thanks to help/fixes from Surya Vikas.