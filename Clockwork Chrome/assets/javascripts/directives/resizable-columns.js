Clockwork.directive('resizableColumns', function ($parse) {
	return {
		link: function (scope, element, attrs) {
			var options = { minWidth: 5 };

			if ($(element).data('resizable-columns-sync')) {
				var $target = $($(element).data('resizable-columns-sync'));

				$(element).on('column:resize', function(event, resizable, $leftColumn, $rightColumn, widthLeft, widthRight)
				{
					var leftColumnIndex = resizable.$table.find('.rc-column-resizing').parent().find('td, th').index($leftColumn);

					var $targetFirstRow = $target.find('tr:first');

					$($targetFirstRow.find('td, th').get(leftColumnIndex)).css('width', widthLeft + '%');
					$($targetFirstRow.find('td, th').get(leftColumnIndex + 1)).css('width', widthRight + '%');

					$target.data('resizableColumns').syncHandleWidths();
					$target.data('resizableColumns').saveColumnWidths();
				});
			}

			$(element).resizableColumns(options);
		}
	};
});
