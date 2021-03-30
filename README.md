# Web tracking analyser #
This extension shows what could be tracked about you online as well as who may possibly be tracking you. This extension currently only works
with Firefox. As for Mar 15, 2020 this extension is independent and does not require a Java server to function. Any version before this will require
a Java server in order to work. Which can be found here https://github.com/LuckySoftware/Web-Tracking-Analyser-Backend. This is a private repo, if you wish to access the extension using the Java backend please get in touch with me. All information is stored locally on your browser, the information is not sent to an external server. This is the reasoning behind the Java server being deprecated to ensure that information is kept private.

## How to use: ##
To use this extension you will need to clone this repo and then follow these steps:
1. Install npm if you don't already have it installed
2. cd into the root of the project
3. run the command "npm install"
4. run the command "npm run build"
5. Open Firefox
6. In the search bar enter "about:debugging"
7. On the left hand side click on "This Firefox"
8. Then click on load temporary addon 
9. You will then want to navigate to the root of this project and go into the "build" folder
10. Click on any file in the build directory

**The Different Views:**
 
Information that could be tracked view:
Shows information that companies could track about you using your IP and Machine, such as what device you are running, who your IP is and where you are roughly located. Used Open street maps to display the location.

![firstview](https://user-images.githubusercontent.com/31455053/113048412-6aef7080-919a-11eb-95d9-164160fad4b5.png)

Force graph view: 
Shows a force graph indiciating all of the outbound requests going out from a website, each line indicates a request that was made to another website which shows that the external site would have the ability to track you.

<img width="1792" alt="fullview" src="https://user-images.githubusercontent.com/31455053/113048820-da656000-919a-11eb-98c2-f920f4526f68.png">

Table view:
The table view shows a more detailed view compared to the force graph it shows you the origin site and the potential tracker as well as if the connection was secure. It shows you when the request was first made and last made as well as the number of times the request was made.

<img width="1257" alt="table-view" src="https://user-images.githubusercontent.com/31455053/113048991-0c76c200-919b-11eb-8e2b-09d85fa76c98.png">

Word cloud view:
The word cloud view shows you who the most prevelant trackers are.

<img width="869" alt="wordcloud-allview" src="https://user-images.githubusercontent.com/31455053/113049233-4d6ed680-919b-11eb-956b-8540da583884.png">

