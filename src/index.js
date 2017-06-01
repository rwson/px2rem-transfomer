import React from "react"
import ReactDOM, { render } from "react-dom"
import { Provider } from "mobx-react"

import App from "components/App"
import { filterStore, commonStore } from "stores"

import "antd/dist/antd.css"
import "css/app.css"

const store = {
	filterStore,
	commonStore
};

render(
	<Provider store={store}>
		<App />
	</Provider>,
    document.getElementById("target")
)
