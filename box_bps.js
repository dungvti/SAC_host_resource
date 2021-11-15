(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Gauge Properties</legend>
				<table>
					<tr>
						<td>QR width</td>
						<td><input id="bps_QRwidth" type="text" size="10" maxlength="10"></td>
					</tr>
					<tr>
						<td>QR height</td>
						<td><input id="bps_QRheight" type="text" size="10" maxlength="10"></td>
					</tr>
					<tr>
						<td>colorDark</td>
						<td><input id="bps_colorDark" type="text" size="10" maxlength="10"></td>
					</tr>	
					<tr>
						<td>colorLight</td>
						<td><input id="bps_colorLight" type="text" size="10" maxlength="10"></td>
					</tr>				
				</table>
				<input type="submit" style="display:none;">
			</fieldset>
		</form>
		<style>
		:host {
			display: block;
			padding: 1em 1em 1em 1em;
		}
		</style>
	`;

	class BoxBps extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							QRwidth: this.QRwidth,
							QRheight: this.QRheight,
							colorDark: this.colorDark,
							colorLight: this.colorLight
						}
					}
			}));
		}

		set QRwidth(QRwidth) {
			this._shadowRoot.getElementById("bps_QRwidth").value = QRwidth;
		}
		
		set QRheight(QRheight) {
			this._shadowRoot.getElementById("bps_QRheight").value = QRheight;
		}
		
		set colorDark(colorDark) {
			this._shadowRoot.getElementById("bps_colorDark").value = colorDark;
		}
		
		set colorLight(colorLight) {
			this._shadowRoot.getElementById("bps_colorLight").value = colorLight;
		}
		
		//////////////
		
		get QRwidth() {
			return this._shadowRoot.getElementById("bps_QRwidth").value;
		}
		
		get QRheight() {
			return this._shadowRoot.getElementById("bps_QRheight").value;
		}
		
		get colorDark() {
			return this._shadowRoot.getElementById("bps_colorDark").value;
		}
		
		get colorLight() {
			return this._shadowRoot.getElementById("bps_colorLight").value;
		}
		
	}

	customElements.define("com-fd-qr-bps", BoxBps);
})();