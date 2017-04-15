var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var ContactSchema = new Schema({
	title: String,
	content: String,
	create_at:{
		type: Date,
		default: Date.now()
	}
});

ContactSchema.virtual('getDate').get(function() {
    var date = new Date(this.create_at);

    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    };
})

ContactSchema.plugin( autoIncrement.plugin, 
	{ model: 'contact', field: 'id', startAt: 1 }
);

module.exports = mongoose.model('contact', ContactSchema);