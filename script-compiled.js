"use strict";

var _ramda = require("ramda");

var _uuid = require("uuid");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var attachedData = new WeakMap();
var attachedChildren = new WeakMap();

var Node =
/*#__PURE__*/
function () {
  function Node(id) {
    _classCallCheck(this, Node);

    this.id = id;
  }

  _createClass(Node, [{
    key: "data",
    set: function set(data) {
      attachedData.set(this, data);
    },
    get: function get() {
      return attachedData.get(this);
    }
  }, {
    key: "children",
    set: function set(children) {
      attachedChildren.set(this, children);
    },
    get: function get() {
      return attachedChildren.get(this);
    }
  }]);

  return Node;
}();

var makeNode = function makeNode(data) {
  var node = new Node((0, _uuid.v4)());
  node.data(data);
};

var traverseBF = root = function (_root) {
  function root(_x) {
    return _root.apply(this, arguments);
  }

  root.toString = function () {
    return _root.toString();
  };

  return root;
}(function (wordComponents) {
  var queue = [root];
  var word = [wordComponents];

  var sameLevelNodes = function sameLevelNodes(root) {
    var arr = [[root]];

    if (root.children) {
      for (var i = 0; i < root.children.length; i++) {
        var child = root.children[i];
        [].concat(arr, [[].push(child)]);
      }

      for (var i = 0; i < root.children.length; i++) {
        var child = root.children[i];
        sameLevelNodes(child);
      }
    }
  };

  while (queue.length) {
    var node = queue.shift();
    var letter = word.shift();
    var newPrefix = true;

    if (!letter.children) {
      return root;
    }

    if (node.data !== letter.data) {
      _toConsumableArray(node.children.push(letter));

      return node;
    }

    if (newPrefix === true) {}

    if (node.data === letter.data && node.children) {
      queue.push.apply(queue, _toConsumableArray(node.children));
    } else if (node.data === letter && position === level && node.children) {}
  }
});

var makeComponents = function makeComponents(components) {
  var _components = _slicedToArray(components, 2),
      root = _components[0],
      words = _components[1];

  words.forEach(function (word) {
    wordComponents = _toConsumableArray(word).reduce(function (acc, curr) {
      var node = makeNode(curr);
      acc.children = node;
      acc = acc.children;
    }, makeNode(word.head));
    traverseBF.apply(void 0, _toConsumableArray(root))(wordComponents);
  });
};

var makeBranches = function makeBranches(trees) {
  trees.forEach(function (tree) {
    (0, _ramda.lift)(makeComponents)(tree);
  });
};

var makeRoots = function makeRoots(trees) {
  return function (input) {
    input.forEach(function (elem) {
      var firstChar = elem.charAt(0);

      var reducer = function reducer(acc, root) {
        if (root.length >= 1) if (root.data == firstChar) {
          acc = false;
        }
      };

      var branchReducer = function branchReducer(acc, root) {
        if (root.length >= 1) if (root.data == firstChar) {
          var _root2 = _slicedToArray(root, 2),
              _ = _root2[0],
              last = _root2[1];

          acc = [_, last.push(elem)];
        }
      };

      var newRoot = trees.reduce(reducer, true);
      var newBranch = trees.reduce(branchReducer, []);

      if (newRoot == true) {
        [].concat(_toConsumableArray(trees), [[makeNode(firstChar), [].push(elem)]]);
      } else {
        [].concat(_toConsumableArray(trees), [newBranch]);
      }
    });
  };
};

var insert = function insert(tree) {
  return function (input) {
    return (0, _ramda.compose)(makeBranches, makeRoots);
  };
};

input = ["apple", "banana", "ace", "app", "ball", "bet"];
