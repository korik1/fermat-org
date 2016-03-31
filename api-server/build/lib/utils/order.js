/**
 * [swapOrder description]
 *
 * @method swapOrder
 *
 * @param  {[type]}   action   [description]
 * @param  {[type]}   oldSpot  [description]
 * @param  {[type]}   newSpot  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
var swapOrder = function (action, oldSpot, newSpot, callback) {
    var query, range, set, rangeMin, rangeMax, res;
    if (action == 'insert') {
        range = newSpot - 1;
        query = {
            'order': {
                '$gt': range
            }
        };
        set = {
            '$inc': {
                'order': 1
            }
        };
    } else if (action == 'update') {
        if (newSpot < oldSpot) {
            rangeMin = newSpot - 1;
            rangeMax = oldSpot + 1;
            query = {
                '$and': [{
                    'order': {
                        '$gt': rangeMin
                    }
                }, {
                    'order': {
                        '$lt': rangeMax
                    }
                }]
            };
            set = {
                '$inc': {
                    'order': 1
                }
            };
        } else if (newSpot > oldSpot) {
            rangeMin = oldSpot;
            rangeMax = newSpot + 1;
            query = {
                '$and': [{
                    'order': {
                        '$gt': rangeMin
                    }
                }, {
                    'order': {
                        '$lt': rangeMax
                    }
                }]
            };
            set = {
                '$inc': {
                    'order': -1
                }
            };
        } else {
            query = {};
            set = {};
        }
    } else if (action == 'delete') {
        range = oldSpot - 1;
        query = {
            'order': {
                '$gt': range
            }
        };
        set = {
            '$inc': {
                'order': -1
            }
        };
    } else {
        return callback(new Error('invalid swap action'), null, null);
    }
    return callback(null, query, set);
};
//
exports.swapOrder = swapOrder;