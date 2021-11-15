(function() { 

	let shadowRoot;
	var Ar = [];
	var ArData = [];
	var ArOptions = [];
	var ArChart = [];
	
	let template = document.createElement("template");
	template.innerHTML = `
		<style>
        body {
            font: 10px arial;
        }
        </style>        
	`;
	let firsttime = 0;
	
	
	function QRChart(divstr, text, value, firsttime, width, height, colorDark, colorLight) { 
       	var list = divstr;
        var child = list.lastElementChild;  
   	    while (child) { 
   	    	list.removeChild(child); 
   	        child = list.lastElementChild; 
   	    } 
    	    
       	var qrcode = new QRCode(divstr, {
       	    text: value,
       	    width: width,
       	    height: height,
       	    colorDark : colorDark,
       	    colorLight : colorLight,
       	    correctLevel : QRCode.CorrectLevel.H
       	});
			
		ArData.push({
			'id': text,
			'data' : divstr
        });	
    };

	function Draw(Ar, firsttime) {
		console.log(Ar);				
			
		for(var i=0; i<Ar.length; i++) {
			QRChart(Ar[i].div, Ar[i].id, Ar[i].text, firsttime, Ar[i].QRwidth, Ar[i].QRheight, Ar[i].colorDark, Ar[i].colorLight);
		}
	};

	class Box extends HTMLElement {
		constructor() {
			super(); 
			shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			
		
			this.addEventListener("click", event => {
				console.log('click');
				var  event = new Event("onClick");
				this.dispatchEvent(event);
			});
			
			this._props = {};
		}	
		
		connectedCallback() {
			console.log("connectedCallback");
		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			console.log("onCustomWidgetBeforeUpdate");
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			console.log("onCustomWidgetAfterUpdate");
			console.log(changedProperties);
			
			if ("text" in changedProperties) {				
				console.log("text:" + changedProperties["text"]);
				this.$text = changedProperties["text"];	
			}
			
			if ("QRwidth" in changedProperties) {				
				console.log("QRwidth:" + changedProperties["QRwidth"]);
				this.$QRwidth = changedProperties["QRwidth"];	
			}
			
			if ("QRheight" in changedProperties) {				
				console.log("QRheight:" + changedProperties["QRheight"]);
				this.$QRheight = changedProperties["QRheight"];	
			}
			
			if ("colorDark" in changedProperties) {				
				console.log("colorDark:" + changedProperties["colorDark"]);
				this.$colorDark = changedProperties["colorDark"];	
			}
			
			if ("colorLight" in changedProperties) {				
				console.log("colorLight:" + changedProperties["colorLight"]);
				this.$colorLight = changedProperties["colorLight"];	
			}
			
			var text = this.$text;
			var QRwidth = this.$QRwidth;
			var QRheight = this.$QRheight;
			var colorDark = this.$colorDark;
			var colorLight = this.$colorLight;
			
			console.log("firsttime: " + firsttime);
			
			if(firsttime === 0) {
				const div = document.createElement('div');
				let divid = changedProperties.widgetName;
				div.innerHTML = '<div id="chart_div' + divid + '"></div>';
				shadowRoot.appendChild(div);
				
				var mapcanvas_divstr = shadowRoot.getElementById('chart_div' + divid);
				console.log(mapcanvas_divstr);
				Ar.push({
					'id': divid,
					'div' : mapcanvas_divstr,
					'text': this.$text,
					'QRwidth': this.$QRwidth,
					'QRheight': this.$QRheight,
					'colorDark': this.$colorDark,
					'colorLight': this.$colorLight					
	            });				
				
				let qrcodejs = "https://raw.githubusercontent.com/dungvti/SAC_host_resource/master/qr.js";
				async function LoadLibs() {
	                try {
	                    await loadScript(qrcodejs, shadowRoot);
	                } catch (e) {
	                    console.log(e);
	                } finally {
	                    Draw(Ar, firsttime);
						firsttime = 1;
	            	}
	            }
	            LoadLibs();										
			} 
			else {
				var item = this.$text.split("|")[0];
				console.log("item: " + item);
				
				var data = this.$text.split("|")[1];
				console.log("data: " + data);
				if(data !== "") {
				
					var foundIndex = Ar.findIndex(x => x.id == item);
					console.log("foundIndex: " + foundIndex);
					
					if(foundIndex !== -1) {
						QRChart(Ar[foundIndex].div, Ar[foundIndex].id, data, firsttime, Ar[foundIndex].QRwidth, Ar[foundIndex].QRheight, Ar[foundIndex].colorDark, Ar[foundIndex].colorLight);
					}
				}				
				
			}		
			
		}
	}
	
	customElements.define("com-fd-qr", Box);

	function loadScript(src, shadowRoot) {
        return new Promise(function(resolve, reject) {
            let script = document.createElement('script');
            script.src = src;

            script.onload = () => {
                console.log("Load: " + src);
                resolve(script);
            }
            script.onerror = () => reject(new Error(`Script load error for ${src}`));

            shadowRoot.appendChild(script)
        });
    }
})();