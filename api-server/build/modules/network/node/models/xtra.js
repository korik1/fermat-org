/**
 * [XtraMdl description]
 *
 * @method XtraMdl
 *
 * @param  {[type]} os     [description]
 * @param  {[type]} sub    [description]
 * @param  {[type]} curncy [description]
 * @param  {[type]} symbl  [description]
 * @param  {[type]} balnc  [description]
 * @param  {[type]} status [description]
 */
function XtraMdl(os, sub, curncy, symbl, balnc, status) {
    'use strict';
    // always initialize all instance properties
    if (os) {
        this.os = os.toLowerCase();
    }
    if (sub) {
        this.sub = sub.toLowerCase();
    }
    if (curncy) {
        this.curncy = curncy.toLowerCase();
    }
    if (symbl) {
        this.symbl = symbl.toUpperCase();
    }
    if (balnc) {
        this.balnc = balnc;
    }
    if (status) {
        this.status = status;
    }
}

// export the class
module.exports = XtraMdl;