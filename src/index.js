import React from "react"
import ReactDOM, { render } from "react-dom"
import { Provider } from "mobx-react"

import App from "components/App"
import { filterStore } from "stores"

import "antd/dist/antd.css"
import "css/app.css"

render(
	<Provider filterStore={ filterStore }>
		<App />
	</Provider>,
    document.getElementById("target")
)
