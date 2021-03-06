//Application

var Table = require('./table')
var Provider = require('./dataProvider')

var tableOptions = {
  target: document.querySelector('.tableView')
}

function onLoad(data) {
  tableOptions.columns = data.outputProperties
  var table = new Table(tableOptions)
  table.render(data.results)
}

var provider = new Provider()
provider.load(onLoad)
