#Table view for Import.io API

##Usage
write your import.io keys and connector params to options.js
```
npm install
npm run build-lib
npm run build-min
npm start
```
open http://localhost:8080

##Issues with Import.io scraper
- https://github.com/import-io/client-js is not working
- There is no Map type in Import.io application
- Import.io cannot parse date
many different date formats tested - none of them work: https://en.wikipedia.org/wiki/List_of_Prime_Ministers_of_the_United_Kingdom_by_longevity

##Bugs
consider missing values
Table breaks on scroll
Doesn't display properly in FF

##Roadmap
Hide columns with the same value - show it before table.

###Data types
Show COUNTRY with flag
