var currencyFormatter = require('currency-symbol.js')

var Self = function (p) {
  var self = this
  self.p = p || {}

  self.container = self.p.target

  var columns = []
  , headers = []
  self.p.columns.forEach(function (c) {
    var column = {}
    switch (c.type) {
      case 'DOUBLE': 
      case 'INT': 
      default:
        column.type = 'numeric'
        break;
      case 'CURRENCY':
        column.type = 'numeric'
        column.renderer = self.currencyRenderer
        break;
      case 'IMAGE':
        column.renderer = self.imgRenderer
        break;
      case 'URL':
        column.renderer = self.urlRenderer
        break;
      case 'BOOLEAN':
        column.type = 'checkbox'
        break;
    }

    headers.push(c.name)
    column.data = c.name
    column.readOnly = true
    columns.push(column)
  })

  self.table = new Handsontable(self.container, {
    startRows: 5,
    colHeaders: headers,
    minSpareRows: 1,
    columns: columns
  })
}

Self.prototype.render = function (data) {
  var self = this
  self.table.loadData(data)
}

Self.prototype.currencyRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  //TODO use native value
  value = instance.getDataAtCell(row, col)
  if (!_.isObject(value)) return

  var span = document.createElement('span')
  span.classList.add('currency')
  span.innerHTML = currencyFormatter.symbolize(value.iso)
  td.appendChild(span)
  var text = document.createTextNode(value.value)
  td.appendChild(text)
  return td
}

Self.prototype.imgRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  //TODO use native value
  value = instance.getDataAtCell(row, col)
  if (!_.isObject(value)) return
  var escaped = Handsontable.helper.stringify(value.src),
    img

  if (escaped.indexOf('http') === 0) {
    img = document.createElement('IMG')
    img.src = value.src
    img.alt = value.alt

    Handsontable.Dom.addEvent(img, 'mousedown', function (e){
      e.preventDefault(); // prevent selection quirk
    });

    Handsontable.Dom.empty(td)
    td.appendChild(img)
  }
  else {
    // render as text
    Handsontable.renderers.TextRenderer.apply(this, arguments)
  }

  return td;
}

Self.prototype.urlRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  //TODO use native value
  value = instance.getDataAtCell(row, col)
  if (!_.isObject(value)) return

  var a = document.createElement('a')
  a.href = value.src
  a.innerHTML = value.text
  td.appendChild(a)
  return td
}

module.exports = Self
