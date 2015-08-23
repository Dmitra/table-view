var options = require('../options')

var Self = function (p) {
  var self = this
}

Self.prototype.load = function (cb) {
  var self = this

  var requestOptions = {
    _user: options.auth.user
  , _apikey: options.auth.apikey
  }
  requestOptions[options.connector.query.type] = options.connector.query.url

  $.ajax({
    type: 'GET'
  , url: 'https://api.import.io/store/data/' + options.connector.GUID + '/_query?'
  , data: requestOptions
  , contentType: 'text/plain'
  , xhrFields: {
      withCredentials: false
    }
  , headers: {}
  , success: self._onLoad.bind(self, cb)
  , error: function(e) {
      console.log(e)
    }
  });
}

Self.prototype._onLoad = function (cb, data) {
  var self = this

  cb(self.process(data))
}

Self.prototype.process = function (data) {
  var rows = data.results
  , columnDefinitions = data.outputProperties

  columnDefinitions.forEach(function (column) {
    column.sameValue = true
    var previousValue = rows[0][column.name]
    rows.forEach(function (row) {
      column.sameValue = previousValue === row[column.name]
      if (column.type === 'URL') {
        row[column.name] = {
          src: row[column.name]
        , text: row[column.name + '/_text']
        }
      } else if (column.type === 'IMAGE') {
      
        row[column.name] = {
          src: row[column.name]
        , alt: row[column.name + '/_alt']
        }
      } else if (column.type === 'CURRENCY') {
        row[column.name] = {
          value: row[column.name]
        , iso: row[column.name + '/_currency']
        }
      } else if (_.isArray(row[column.name])) {
        row[column.name] = row[column.name].toString()
      }
    })
  })
  return data
}

module.exports = Self
