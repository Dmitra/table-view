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
        column.renderer = self._currencyRenderer
        break;
      case 'IMAGE':
        column.renderer = self._imgRenderer
        break;
      case 'URL':
        column.renderer = self._urlRenderer
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

  var tableConfig = {
    colHeaders: headers,
    currentRowClassName: 'currentRow',
    currentColClassName: 'currentCol',
    rowHeaders: true,
    manualColumnResize: true,
    manualRowResize: true,
    //TODO breaks freezing column
    //manualColumnMove: true,
    //manualRowMove: true,
    allowRemoveColumn: true,
    contextMenu: true,
    manualColumnFreeze: true,
    allowInsertRow: false,
    allowInsertColumn: false,
    columns: columns
  }

  self.table = new Handsontable(self.container, tableConfig)
}
/**
 * Render table with data
 */
Self.prototype.render = function (data) {
  var self = this
  self.table.loadData(data)
}
/**
 * render cells formatted with currency symbol
 */
Self.prototype._currencyRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  //TODO use passed value
  value = instance.getDataAtCell(row, col)
  if (!_.isObject(value) || !value.value) return Handsontable.renderers.TextRenderer(instance, td, row, col, prop, '', cellProperties)

  Handsontable.Dom.empty(td)
  var span = document.createElement('span')
  span.classList.add('currency')
  span.innerText = currencyFormatter.symbolize(value.iso)
  td.appendChild(span)
  var text = document.createTextNode(value.value)
  td.appendChild(text)
  return td
}
/**
 * render cells with image
 */
Self.prototype._imgRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  //TODO use passed value
  value = instance.getDataAtCell(row, col)
  if (!_.isObject(value) || !value.src) return Handsontable.renderers.TextRenderer(instance, td, row, col, prop, '', cellProperties)

  var escaped = Handsontable.helper.stringify(value.src)

  if (escaped.indexOf('http') === 0) {
    Handsontable.Dom.empty(td)
    $(td).addClass('img-cell')
    $(td).css('background-image', 'url(' + value.src + ')')
  }
  else {
    // render as text
    Handsontable.renderers.TextRenderer.apply(this, arguments)
  }

  return td
}
/**
 * render cells with links
 */
Self.prototype._urlRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  //TODO use passed value
  value = instance.getDataAtCell(row, col)
  if (!_.isObject(value) || !value.src) return Handsontable.renderers.TextRenderer(instance, td, row, col, prop, '', cellProperties)

  td.innerHTML = '<a href="' + value.src + '">' + value.text + '</a>'
  return td
}

module.exports = Self
