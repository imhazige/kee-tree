(function () {
	function erase(arr, elm) {
		for (var i = 0; i < arr.length; i++)
			if (elm == arr[i])
				arr[i] = null;
	}

	var userAgent = navigator.userAgent.toLowerCase();

	window.kzg = {
		browser: {
			version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [
				0, '0'])[1],
			safari: /webkit/.test(userAgent),
			opera: /opera/.test(userAgent),
			msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
			mozilla: /mozilla/.test(userAgent)
			&& !/(compatible|webkit)/.test(userAgent),
			chrome: /chrome/.test(userAgent)
		},
		get: function (id) {
			return document.getElementById(id);
		},
		setStyle: function (el, styleText) {
			if (this.browser.msie && this.browser.version < 8) {
				el.style.cssText = styleText;
			} else {
				el.setAttribute("style", styleText);
			}
		},
		addCss: function (el, css) {
			if (!css || '' == css) {
				return;
			}
			var ncss = this._getCsss(el);
			var acsss = css.split(/\s+/);
			for (var i = 0; i < acsss.length; i++) {
				ncss[acsss[i]] = acsss[i];
			}
			var cssName = '';
			for (k in ncss) {
				if ('' == k) {
					continue;
				}
				cssName += ' ' + k;
			}
			this.setCss(el, cssName);
		},
		removeCss: function (el, css) {
			if (!css || '' == css) {
				return;
			}
			var ncss = this._getCsss(el);
			var cssName = '';
			for (k in ncss) {
				if ('' == k || css == k) {
					continue;
				}
				cssName += ' ' + k;
			}
			this.setCss(el, cssName);
		},
		_getCsss: function (el) {
			var ncss = {};
			var ocss = this.getCss(el);
			var oacsss = ocss ? ocss.split(/\s+/) : [];
			for (var i = 0; i < oacsss.length; i++) {
				ncss[oacsss[i]] = oacsss[i];
			}

			return ncss;
		},
		getCss: function (el) {
			if (this.browser.msie && this.browser.version < 8) {
				return el.getAttribute("className");
			} else {
				return el.getAttribute("class");
			}
		},
		setCss: function (el, argCssName) {
			if (this.browser.msie && this.browser.version < 8) {
				el.setAttribute("className", argCssName);
			} else {
				el.setAttribute("class", argCssName);
			}
		},
		clearCss: function (el) {
			this.setStyle('');
			if (this.browser.msie && this.browser.version < 8) {
				el.removeAttribute("className");
			} else {
				el.removeAttribute("class");
			}
		},
		remove: function (argObj) {
			if (argObj.parentNode) {
				argObj.parentNode.removeChild(argObj);
			}
		},
		on: function (elem, type, fn) {
			if (elem.addEventListener)
				elem.addEventListener(type, function (e) {
					fn(e);
				}, false);
			else if (elem.attachEvent)
				elem.attachEvent("on" + type, function () {
					fn(window.event);
				});
		},
		/*
		 * un : function(el, type, fn) { $(el).unbind(type, fn); },
		 */
		oe: function (o, type, fn) {
			if (!o.eves)
				o.eves = [];
			if (!o.eves[type])
				o.eves[type] = [];
			o.eves[type][o.eves[type].length] = fn;
		},
		ue: function (o, type, fn) {
			if (!o.eves)
				return;
			if (!o.eves[type])
				return;
			erase(o.eves[type], fn);
		},
		fire: function (o, type, ops) {
			if (!o.eves)
				return;
			if (!o.eves[type])
				return;
			var e = {
				src: o,
				stop: false
			};
			for (var i = 0; i < o.eves[type].length; i++) {
				if (o.eves[type][i]) {
					o.eves[type][i](e, ops);
					if (e.stop)
						return;
				}
			}
		},
		cr: function (tag) {
			return document.createElement(tag);
		},
		crradio: function (argName, argIsChecked) {
			var radio;

			if (this.browser.msie && this.browser.version < 8) {
				var text = "<input type=\"radio\" name=\"" + argName
					+ "\" value=\"checked\" >";
				radio = document.createElement(text);
			} else {
				radio = document.createElement("input");
				radio.setAttribute("type", "radio");
				radio.setAttribute("name", argName);
				radio.setAttribute("value", "checked");
			}
			radio.checked = argIsChecked;

			return radio;
		},
		ok: function (fn) {
			kzg.oe(kzg, 'ok', fn);
		},
		inade: function (argObj, argStrsomewhere, argNewObj) {
			var parent;

			switch (argStrsomewhere.toLowerCase()) {
				case "beforebegin":
					argObj.parentNode.insertBefore(argNewObj, argObj);
					break;
				case "afterbegin":
					var nn = !argObj.childNodes ? null : argObj.childNodes[0];
					if (!nn) {
						nn = null
					}
					;
					argObj.insertBefore(argNewObj, nn);
					break;
				case "beforeend":
					argObj.appendChild(argNewObj);
					break;
				case "afterend":
					var nnode = this.nextnode(argObj);
					argObj.parentNode.insertBefore(argNewObj, nnode);
					break;
			}
		},
		nextnode: function (argObj) {
			var parent, obj;

			obj = null;
			parent = argObj.parentNode;
			for (var i = 0; parent.childNodes[i]; i++) {
				if (parent.childNodes[i] === argObj) {
					try {
						obj = parent.childNodes[i + 1];
					} catch (e) {
						obj = null;
					}
					break;
				}
			}
			return obj;
		}
		
	};

	kzg.Url = function (argOrginUrl) {
		var _this = this;
		var params = {};
		var baseurl = null;

		this.putParam = function (argKey, argValue) {
			if (argKey && argValue) {
				params[argKey] = argValue;
			}
		};
		this.getParam = function (argKey) {
			return params[argKey];
		};

		this.toString = function () {
			var keys = params.keyset;
			var url = baseurl;
			var qs = "?";
			for (k in params) {
				var value = params[k];
				if (value === 0 || value) {
					url = url + qs + k + "=" + value;
				}
				qs = "&";
			}

			return url;
		};

		if (!argOrginUrl || "" == argOrginUrl) {
			throw new Error("orgin url null.");
		}
		var index = argOrginUrl.indexOf("?");
		if (-1 != index) {
			baseurl = argOrginUrl.substring(0, index);
			if (index + 1 < argOrginUrl.length - 1) {
				var querystring = argOrginUrl.substring(index + 1);
				var kvss = querystring.split("&");
				for (var i = 0; i < kvss.length; i++) {
					var kvs = kvss[i].split("=");
					if (1 >= kvs.length) {
						continue;
					}
					_this.putParam(kvs[0], kvs[1]);
				}
			}
		} else {
			baseurl = argOrginUrl;
		}
	};

	kzg.on(window, "load", function () {
		kzg.fire(kzg, 'ok');
	});
})();

/**
 * the treenode
 * 
 * @configbegin
 * @tree the tree of the node stand in
 * @text caption of the node show on the
 * @key a unique key in the whole tree for this node,and can find this node by
 *      the key
 * @icon the image of this node
 * @expandStyle "always" or "auto"(default),it is useful set to "always" when
 *              this is a lazy-loading node(such as ajax-loading)
 * @type kzg.Tree.CHECKBOX or kzg.Tree.RADIOBOX
 * @configend
 * @require [base] Tree.js
 */

kzg.TreeNode = function (ops) {
	var tree = ops.tree;
	this.tree = tree;

	var node = this;
	// keydex is the index and key of every node,but is not really the index
	node.keydex = null;
	// nbody is the nodebody
	var nbody = kzg.cr("span");
	var container = kzg.cr("span");
	kzg.inade(container, "afterBegin", nbody);
	node.body = nbody;
	node.container = container;

	var STYLE_NODE = "color:#000000;";

	node.first = node.last = node.next = node.prev = null;
	node.caption = ops.text;
	node.tier = null;
	node.parent = null;
	node.hasChild = false;
	node.labstyle = null;
	node.type = ops.type;
	// joker:node.expandStyle:alwalys|auto
	node.expandStyle = ops.expandStyle != null ? ops.expandStyle : "auto";
	node.exIcon = null;
	var icon = new Image();
	icon.align = "absmiddle";
	node.label = null;
	node.icon = icon;
	node.tree = tree;
	node.lineIcon = [];
	node.type = ops.type ? ops.type : kzg.Tree.NORMAL;
	node.children = [];
	node.key = ops.key;

	var depth;
	depth = tree.depth;
	node.label = kzg.cr("span");
	kzg.setStyle(container, "margin:0px;padding:0px;white-space:nowrap;");

	kzg.inade(nbody, "beforeEnd", node.label);
	kzg
		.setStyle(nbody,
		'margin:0px;cursor:default;text-align:left;color:black;font-size:9pt;');

	if (ops.iconCls) {
		icon.src = kzg.Tree.S;
		kzg.setCss(icon, ops.iconCls);
	} else {
		if (ops.icon) {
			icon.src = ops.icon;
		} else {
			icon.src = kzg.Tree.S;
			kzg.setCss(icon, 'zk_tree_icon_default');
		}
	}

	kzg.setStyle(node.label, tree.labelStyle);

	kzg.inade(nbody, "afterBegin", icon)

	icon.tabIndex = node.label.tabIndex = 1;
	icon.hideFocus = true;

	// Joker:all add param node
	node.select = function () {
		if (!node.isEnable()) {
			return;
		}
		tree.doSelect(node);
	};
	node.enable = function (enable) {
		node.disabled = false === enable;
	};
	node.isEnable = function () {
		return !node.disabled;
	};
	node.isVisible = function () {
		var str;

		str = node.container.style.display;
		return str && str != "none";
	};

	kzg.on(node.label, 'click', node.select);
	kzg.on(node.icon, 'click', node.select);
	nbody.oncontextmenu = function () {
		var e;
		if (kzg.browser.msie) {
			e = window.event;
		} else {
			e = arguments[0];
		}
		if (tree.oncontextmenu) return tree.oncontextmenu(e, node);
	};

	node.addExIcon = function () {
		if (!node.exIcon) {
			node.exIcon = new Image();
			node.exIcon.align = "absmiddle";
			node.exIcon.src = kzg.Tree.S;
			kzg.on(node.exIcon, 'click', function () {
				node.expand();
			});
			var o = node.icon.src == '' ? node.label : node.icon;
			kzg.inade(o, "beforeBegin", node.exIcon);
		}
	}

	// delete all the child of the node
	node.removeChildren = function () {
		var count = node.getChildrenCount();

		for (var i = 0; node.children[i];) {
			tree.removeNode(node.children[i], true);
		}
	};

	/*
	 * node.setExpandStyle argStyle:["auto"|"always"]:node's expand styles
	 */
	node.setExpandStyle = function (argStyle) {
		if (null == argStyle) {
			argStyle = node.expandStyle;
		}
		if (argStyle == "always") {
			node.addExIcon();
			if (!node.hasChild && node.expanded) {
				node.expanded = false;
			}
		} else if (argStyle == "auto" && node.expandStyle != "auto") {
			if (!node.hasChild && node.exIcon != null && !tree.isLineStyle()) {
				node.body.removeChild(node.exIcon);
				node.exIcon = null;
			}
		}
		node.expandStyle = argStyle;
		tree.setExIcon(node);
	};

	/**
	 * node.expand:expand this node
	 * 
	 * @param isShow
	 *            [true|false]:is expand or collapse
	 * @param incSub
	 *            [true|false]:is the sub node's child node need do the same
	 *            thing
	 */
	node.expand = function (isShow, incSub) {
		// Joker:
		// if(node.children.length==0)return;
		if (node.children.length == 0 && node.expandStyle != "always")
			return;

		if (isShow == null) {
			node.expanded = !node.expanded;
		} else {
			node.expanded = isShow;
		}// end if
		var sh = node.expanded ? "block" : "none";
		var icount = node.children.length;
		for (var i = 0; i < icount; i++) {
			node.children[i].container.style.display = sh;
			// baseFunc.setSingleStyle(node.children[i].container,"display",sh);
			if (incSub && (!(isShow ^ node.children[i].expanded))) {
				node.children[i].expand(node.expanded, true);
			}
		}
		tree.setExIcon(node);

		// Joker:add node Eventarg to node.onexpand
		if (node.expanded) {
			kzg.fire(node, 'expand');
		} else {
			kzg.fire(node, 'collapse');
		}
	};

	if (kzg.Tree.CHECKBOX == node.type) {
		var chkBox = null;

		chkBox = kzg.cr("input");
		chkBox.setAttribute("type", "checkbox");
		chkBox.align = "absmiddle";
		chkBox.style.verticalAlign = 'middle';
		kzg.inade(node.label, "beforeBegin", chkBox);
		node.checkBox = chkBox;
		chkBox.checked = node.checked = false;
		// fire oncheck event
		kzg.on(chkBox, 'click', function () {
			node.checked = chkBox.checked;
			kzg.fire(node, 'click');
		});
	} else if (kzg.Tree.RADIOBOX == node.type) {
		node.rdobox = null;
		node.checked = false;

		var rdoBox = kzg.crradio(null, false);
		rdoBox.style.verticalAlign = 'middle';
		kzg.inade(node.label, "beforeBegin", rdoBox);
		// fire oncheck event
		kzg.on(rdoBox, 'click', function () {
			node.setRadioCheck();
		});
		node.rdoBox = rdoBox;
	}

	/**
	 * set the check box checked or not,this method can't be called before this
	 * node is added to the tree
	 * 
	 * @param _argChecked
	 *            check or not check
	 * @param _argsetChild
	 *            if set the children of the node checkd as their parent
	 * @param _argFireEvent
	 *            if fire the oncheck event
	 */
	node.setChecked = function (_argChecked, _argsetChild, _argFireEvent) {
		if (kzg.Tree.CHECKBOX != node.type) {
			return;
		}
		if (_argFireEvent) {

		}

		// Joker:care this check
		// is necessary or it will cause infinitude recursion
		if (node.checkBox.checked != _argChecked) {
			node.checked = node.checkBox.checked = _argChecked;
			if (_argFireEvent) {
				kzg.fire(node, 'click');
			}
		}
		if (_argsetChild) {
			for (var i = 0; i < node.getChildrenCount(); i++) {
				node.children[i].setChecked(_argChecked, true, _argFireEvent);
			}
		}
	};

	/**
	 * set the radio checkbox checked,this method can't be called before this
	 * node is added to the tree
	 * 
	 * @param _argFireEvent
	 *            is fire the event
	 */
	node.setRadioCheck = function () {
		if (kzg.Tree.RADIOBOX != node.type) {
			throw new Error("this is not a radiobox node.");
		}

		var p;
		var nd;
		var oNode;

		p = node.parent;

		if (p != null && p != tree.root) {
			oNode = p.checkedRdobox;
			for (var i = 0; i < p.getChildrenCount(); i++) {
				nd = p.children[i];
				if (nd.rdoBox && node != nd) {
					nd.checked = nd.rdoBox.checked = false;
				}
			}
			p.checkedRdobox = node;
		}
		node.checked = node.rdoBox.checked = true;
		// fire
		if (node.parent && node.parent != tree.root) {
			if (oNode != node) {
				kzg.fire(node.parent, 'rdocheckchanged', {
					preNode: oNode,
					curNode: node
				});
			}
		}

	};

	this.setCaption = function (argCaption) {
		node.caption = argCaption;
		node.label.innerHTML = argCaption;
	};
	node.setCaption(ops.text);

	node.remove = function () {
		tree.removeNode(node);
	}
	node.getChildrenCount = function () {
		return node.children ? node.children.length : 0
	};
	node.getTier = function () {
		return node.tier;
	}

	return node
}


kzg.Tree = function (ops) {
	var tree = this;

	var defaultTheme = {
		zk_tree_icon_blank: null,
		zk_tree_icon_leaf_top: null,
		zk_tree_icon_leaf: null,
		zk_tree_icon_twig: null,
		zk_tree_icon_collapse: null,
		zk_tree_icon_expand: null,
		zk_tree_icon_collapse_top: null,
		zk_tree_icon_expand_top: null,
		zk_tree_icon_collapse_mid: null,
		zk_tree_icon_expand_mid: null,
		zk_tree_icon_collapse_end: null,
		zk_tree_icon_expand_end: null
	};

	if (!kzg.Tree.SI) {
		kzg.Tree.SI = new Image();
		kzg.Tree.SI.src = kzg.Tree.S
	}
	var COLOR_SELECT_BG = "highlight";

	var labelStyle = ops.labelStyle
		? labelStyle
		: "padding:0;margin-left:2;vertical-align:middle;text-align:left;"
	this.labelStyle = labelStyle;
	tree.depth = 0;
	var count = 0, nodes = [];

	// is show line
	this.showline = ops.showline;

	// checkbox
	var colChkNode = [];
	// radiobox
	var colrdoNode = [];

	// root
	// inner object: root
	var root = {};
	root.children = [];
	root.expanded = true;
	root.getTier = function () {
		return 0;
	}

	tree.selectedNode = null;
	// return the object's index in the array,return -1 if not found

	var isExpandable = function (srcNode) {
		return srcNode.expandStyle == "always" || srcNode.hasChild;
	};// end md

	var isFirstTop = function (srcNode) {
		return srcNode.parent == root && root.children[0] == srcNode;
	};// end md

	var isLeaf = function (srcNode) {
		return srcNode.next != null;
	};// end md

	var isTwig = function (srcNode) {
		return srcNode.next == null;
	};// end md

	// inner function :
	/**
	 * set the icon of the expandable node
	 * 
	 * @param srcNode
	 */
	var setExIcon = function (srcNode) {
		var strImgkey;
		var expanded = srcNode.expanded;

		if (!isExpandable(srcNode)) {
			// not expandable
			if (!tree.showline) {
				// if (srcNode.exIcon) {
				// kzg.remove(srcNode.exIcon);
				// return;
				// }
				strImgkey = 'zk_tree_icon_blank';
			} else {
				if (isFirstTop(srcNode)) {
					// is first top,this is special
					if (isTwig(srcNode)) {
						// has no sister
						if (srcNode.exIcon) {
							strImgkey = 'zk_tree_icon_blank';
						}
					} else {
						strImgkey = 'zk_tree_icon_leaf_top';
					}
				} else if (isLeaf(srcNode)) {
					strImgkey = 'zk_tree_icon_leaf';
				} else {
					strImgkey = 'zk_tree_icon_twig';
				}
			}
		} else {
			// need show expand
			if (!tree.showline) {
				strImgkey = expanded ? 'zk_tree_icon_collapse_noline' : 'zk_tree_icon_expand_noline';
			} else {
				if (isFirstTop(srcNode)) {
					if (isTwig(srcNode)) {
						strImgkey = expanded
							? "zk_tree_icon_collapse"
							: "zk_tree_icon_expand";
					} else {
						strImgkey = expanded
							? "zk_tree_icon_collapse_top"
							: "zk_tree_icon_expand_top";
					}
				} else if (isLeaf(srcNode)) {
					strImgkey = expanded
						? "zk_tree_icon_collapse_mid"
						: "zk_tree_icon_expand_mid";
				} else {
					strImgkey = expanded
						? "zk_tree_icon_collapse_end"
						: "zk_tree_icon_expand_end";
				}
			}
		}
		// if (tree.showline && !srcNode.exIcon) {
		// srcNode.addExIcon();
		// }
		if (!srcNode.exIcon) {
			srcNode.addExIcon();
		}
		if (srcNode.exIcon) {
			srcNode.icon.style.marginLeft = "0";
			kzg.setCss(srcNode.exIcon, strImgkey);
		} else {
			if (!tree.showline) {
				srcNode.icon.style.marginLeft = kzg.Tree.SI.width;
			}
		}

		return;
	}
	this.setExIcon = setExIcon;

	/*
	 * setLine :set the "|" line icon
	 */
	var setLine = function (srcNode, idx) {
		// if (!tree.showline)
		// return;

		if (srcNode.hasChild) {
			for (var i = 0; i < srcNode.children.length; i++) {
				kzg.setCss(srcNode.children[i].lineIcon[idx], !tree.showline
					? 'zk_tree_icon_blank'
					: 'zk_tree_icon_line');
				setLine(srcNode.children[i], idx);
			}
		}
	}
	this.setLine = setLine;

	var doSelect = function (srcNode) {
		// reset previous selected node
		if (tree.selectedNode != null) {
			tree.selectedNode.label.style.background = tree.selectedNode.label._background;
			tree.selectedNode.label.style.color = tree.selectedNode.label._color;
		}
		srcNode.label._background = srcNode.label.style.background
			? srcNode.label.style.background
			: 'none';
		srcNode.label._color = srcNode.label.style.color
			? srcNode.label.style.color
			: 'black';
		srcNode.label.style.background = COLOR_SELECT_BG;
		srcNode.label.style.color = "highlighttext";

		tree.selectedNode = srcNode;
		kzg.fire(tree, 'select');
	}
	this.doSelect = doSelect;

	this.enable = function (enable) {
		var enable = false !== enable;

		for (var i = 0; i < count; i++) {
			nodes[i].enable(enable);
		}
	};

	var addNode = function (toNode, node) {
		node.tier = toNode.getTier() + 1;
		toNode.children[toNode.children.length] = node;
		var o = toNode == root ? tree.body : toNode.container;
		kzg.inade(o, "beforeEnd", node.container);
		node.parent = toNode;
		// set the brother:can optimize
		if (toNode.hasChild) {
			node.prev = toNode.last;
			toNode.last.next = node;
			toNode.last = node;
		} else {
			toNode.first = toNode.last = node;
		}
		// can opt
		node.keydex = toNode.getChildrenCount();

		node.parent.hasChild = true;
		if (tree.depth < node.tier)
			tree.depth = node.tier;
		node.container.style.display = node.parent.expanded ? "block" : "none";
		var indent = ops.indent ? ops.indent : 16;
		// if (!tree.showline) {
		// node.body.style.textIndent = indent * (node.tier - 1) + "px";
		// }
		// is the branch icon show
		// if (tree.showline) {
		// node.addExIcon();
		// }
		// set the line
		if (true) {
			// if (tree.showline) {
			for (var i = node.tier - 2; i >= 0; i--) {
				var img = new Image();
				img.align = "absmiddle";
				img.src = kzg.Tree.S;
				kzg.inade(node.body, "afterBegin", img);
				node.lineIcon[i] = img;
			}
			if (node.prev != null) {
				tree.setLine(node.prev, node.tier - 1);
			}
			var n = node.parent;
			var i = node.tier - 2;
			while (n != root && i >= 0) {
				if (n.next != null) {
					kzg.setCss(node.lineIcon[i], !tree.showline
						? 'zk_tree_icon_blank'
						: 'zk_tree_icon_line');
					// node.lineIcon[i].src=tree.icons["line"].src;
				}
				n = n.parent;
				i--;
			}
		}
		// Joker:add expand image with the style judgement
		var ma = node.parent;
		if (ma != root) {
			if (ma.exIcon == null) {
				// note:the real expand icon is set when add child
				ma.exIcon = new Image();
				ma.exIcon.src = kzg.Tree.S;
				ma.exIcon.align = "absmiddle";
				kzg.on(ma.exIcon, 'click', function () {
					ma.expand();
				});
				var o = ma.icon.src == "" ? ma.label : ma.icon;
				kzg.inade(o, "beforeBegin", ma.exIcon);
			}

			// Joker:
			tree.setExIcon(ma);
		}
		node.expanded = true;
		// set the left margin
		if (!isExpandable(node)) {
			node.icon.style.marginLeft = kzg.Tree.SI.width;
		}
		node.expanded = true;
		node.setExpandStyle();
		if (node.prev && tree.showline) {
			tree.setExIcon(node.prev);
		}
		if (node.key && node.key != '') {
			tree.nodes[node.key] = node;
		}
		tree.nodes[count] = node;
		count++;

		return node;
	}
	this.addNode = addNode;

	// remove

	// remove the element in the array
	function removeo(arr, obj) {
		var bl;

		bl = false;
		for (var i = 0; i < arr.length; i++) {
			if (obj === arr[i] || bl) {
				arr[i] = arr[i + 1];
				bl = true;
			}
		}
		if (bl) {
			arr.length--;
		}
	}

	var remove = function (srcNode) {
		kzg.remove(srcNode.container);
		removeo(nodes, srcNode);
	}

	/**
	 * remove all the nodes of the tree
	 */
	this.removeAll = function () {
		var count;
		var nds;

		nds = tree.root.children;
		count = nds.length;
		for (var i = 0; i < count;) {
			if (nds[i]) {
				tree.removeNode(nds[i], true);
			} else {
				i++;
			}
		}
	};

	/**
	 * @param srcNode
	 * @param argIsRecursion
	 *            is this is the recurse invoke,need this to enhance performance
	 */
	this.removeNode = function (srcNode, argIsRecursion) {
		if (!srcNode) {
			return;
		}// end if

		if (!srcNode.hasChild) {
			remove(srcNode);
			var ma = srcNode.parent, jj = srcNode.prev, mm = srcNode.next;
			if (!argIsRecursion) {
				// set the state
				if (ma.first == srcNode && ma.last == srcNode && ma != root) {
					ma.hasChild = false;
					// when the only child been removed,if it's not expand style
					// of "always"
					// it shuold remove the expand icon,but I don't known why
					// "alai" use this method to remove
					// I change to remove the icon
					// document.createElement("div").insertAdjacentElement("afterBegin",ma.exIcon);
					if (ma.expandStyle != "always") {
						kzg.remove(ma.exIcon);
					} else {
						ma.expanded = false;
					}

					setExIcon(ma);
					ma.first = ma.last = null;
				} else {
					if (jj != null) {
						jj.next = mm;
						setExIcon(jj);
					} else {
						ma.first = mm;
					}// end if
					if (mm != null) {
						mm.prev = jj;
						setExIcon(mm);
						// hold the keydex state
						var dd;
						dd = mm;
						while (dd) {
							dd.keydex--;
							dd = dd.next;
						}
					} else {
						ma.last = jj;
					}
				}
			}

			// do not forget to remove the obj from the children
			if (ma != root) {
				removeo(ma.children, srcNode);
				if (ma.children.length < 1) {
					ma.hasChild = false;
				}
			}
			count--;
			srcNode = null;
		} else {
			var count = srcNode.children.length;
			for (var i = 0; i < count;) {
				if (srcNode.children[i]) {
					tree.removeNode(srcNode.children[i], true);
				} else {
					i++;
				}
			}
			tree.removeNode(srcNode, argIsRecursion);
		}
	}

	/**
	 * tree.locate locate the node by its keydex
	 * 
	 * @param argKeydex
	 *            the keydex of the node
	 */
	var locate = function (argKeydex) {
		var strsKeydexs;
		var index;
		var tNode;

		// the "." represent the root
		if ("." == argKeydex) {
			return tree.root;
		}
		tNode = tree.root;
		strsKeydexs = argKeydex.split(".");
		for (var i = 0; i < strsKeydexs.length; i++) {
			if ("" != strsKeydexs[i]) {
				index = new Number(strsKeydexs[i]);
				tNode = tNode.children[index - 1];
			}
		}
		// if a wrong argKeydex ,return null
		if (tree.root == tNode) {
			return null;
		}
		return tNode;
	}
	this.locate = locate;

	/**
	 * get the node's keydex path,note the keydex is start from 1
	 * 
	 * @param argNode
	 */
	this.getNodeKeydex = function (argNode) {
		var strKeydex;
		var pNode;

		strKeydex = argNode != root ? argNode.keydex : "";
		pNode = argNode.parent;
		while (root != pNode) {
			strKeydex = pNode.keydex + "." + strKeydex;
			pNode = pNode.parent;
		}
		strKeydex = "." + strKeydex;

		return strKeydex;
	}

	// getChildrenCount
	root.getChildrenCount = function () {
		return root.children != null ? root.children.length : 0;
	}

	this.getNodesByTier = function (num) {
		var col = [];
		for (var i = 0; i < count; i++) {
			if (nodes[i].getTier() == num) {
				col[col.length] = nodes[i];
			}
		}
		return col;
	}

	/**
	 * the param is the same as the expand
	 */
	this.expandAll = function (isShow, argIncsub) {
		isShow = isShow == null ? !root.expanded : isShow;
		for (var i = 0; i < count; i++) {
			nodes[i].expand(isShow, argIncsub);
			root.expanded = isShow;
		}
	}

	/**
	 * @param num
	 *            the number of the tier
	 * @param argIsneedCollapse
	 *            is need collapse all first [for optimize]
	 */
	this.expandToTier = function (num) {
		// collapse all first

		for (var i = 0; i < count; i++) {
			// collapse when is this tier
			if (nodes[i].getTier() == num && nodes[i].expanded) {
				nodes[i].expand(false, false);
			}

			if (nodes[i].getTier() < num && !nodes[i].expanded) {
				nodes[i].expand(true, false);
			}
		}
	};
	this.body = kzg.cr("div")

	this.count = function () {
		return count;
	}
	this.root = root;
	this.nodes = nodes;

	kzg.inade(ops.to, 'afterBegin', tree.body);
}

kzg.Tree.NORMAL = 0;
kzg.Tree.CHECKBOX = 1;
kzg.Tree.RADIOBOX = 2;

