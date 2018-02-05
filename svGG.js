function printSvg(svg,filename)
{
	var clone = svg.cloneNode(true);
    clone.id = "svg-print";
    document.body.appendChild(clone);
    var elements = clone.querySelectorAll("*");
    var cs;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].currentStyle)
            cs = elements[i].currentStyle;
        else if (window.getComputedStyle)
            cs = document.defaultView.getComputedStyle(elements[i], null);

        for (var prop in cs) {
            if (cs[prop] != undefined && cs[prop].length > 0 && typeof cs[prop] !== 'object' && typeof cs[prop] !== 'function' && prop != parseInt(prop)) {
                elements[i].style[prop] = cs[prop];
            }
        }
    }


    var xml = new XMLSerializer().serializeToString(clone),
        data = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
    document.body.removeChild(clone);
    var link = document.createElement("a");
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function printPNG(svg,filename)
{
	var clone = svg.cloneNode(true);
	clone.id = "svg-print";
    document.body.appendChild(clone);
    var bbox = clone.getBBox();
    var viewBox = [bbox.x - 10, bbox.y - 10, bbox.width + 20, bbox.height + 20].join(" ");
    clone.setAttribute("width", bbox.width + 20);
    clone.setAttribute("height", bbox.height + 20);
    clone.setAttribute("viewBox", viewBox);

    var elements = clone.querySelectorAll("*");
    var cs;

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].currentStyle)
            cs = elements[i].currentStyle;
        else if (window.getComputedStyle)
            cs = document.defaultView.getComputedStyle(elements[i], null);

        for (var prop in cs) {
            if (cs[prop] != undefined && cs[prop].length > 0 && typeof cs[prop] !== 'object' && typeof cs[prop] !== 'function' && prop != parseInt(prop)) {
                elements[i].style[prop] = cs[prop];
            }
        }
    }

    var xml = new XMLSerializer().serializeToString(clone);
    var canvas = document.createElement("canvas");
    canvas.width = bbox.width + 20;
    canvas.height = bbox.height + 20;

    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([xml], {type: "image/svg+xml;charset=utf-8"});
    var url = DOMURL.createObjectURL(svg);
    var png_image = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var png = canvas.toDataURL("image/png");
        png_image.src = png;

        var link = document.createElement("a");
        link.href = png;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        DOMURL.revokeObjectURL(png);
    };
    document.body.removeChild(canvas);

    img.src = url;
}
