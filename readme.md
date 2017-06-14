Recog Tester
===

A simple utility that lets you compare the results from multiple image recognition APIs. Currently supports IBM Watson, Google, and Microsoft.

To test, you need the proper authentication information for each of the supported services. Use creds.json for this. The "form" of this file is:

	{
		"google": { contents of JSON file },
		"ibm": {
			"api_key":"..."
		},
		"microsoft": {
			"url":"...",
			"key":"..."
	}

