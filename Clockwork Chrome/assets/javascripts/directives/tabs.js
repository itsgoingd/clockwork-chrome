Clockwork.directive('tabs', function ($parse) {
	return {
		link: function (scope, element, attrs) {
			let tabs = element[0]
			let namespace = tabs.getAttribute('tabs')
			let namespacePrefix = namespace ? `${namespace}.` : ''

			let attributeStartsWith = (attribute, prefix) => {
				return (element) => element.getAttribute(attribute).startsWith(prefix)
			}

			tabs.addEventListener('click', ev => {
				if (! ev.target.getAttribute('tab-name')) return

				let tabName = ev.target.getAttribute('tab-name')

				if (namespace && ! tabName.startsWith(namespacePrefix)) return

				tabs.querySelectorAll(`[tab-name^="${namespacePrefix}."]`)
					.forEach(el => el.classList.remove('active'))
				ev.target.classList.add('active')

				tabs.querySelectorAll(`[tab-content^="${namespacePrefix}"]`)
					.forEach(el => el.style.display = 'none')
				tabs.querySelector(`[tab-content="${tabName}"]`).style.display = 'block'
			})

			tabs.querySelectorAll(`[tab-name^="${namespacePrefix}"].active`).click()
		}
	}
})
