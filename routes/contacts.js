var express = require('express');
var router = express.Router();
var ContactModel = require('../models/ContactModel');
var CommentModel = require('../models/CommentModel');

router.get('/', function (req, res) {

	ContactModel.find( {}, function(err, contacts) {
		res.render('contacts/list', { contacts: contacts });	
	});
});

router.get('/write', function(req, res) {
	// 수정할때 contact를 넘겨서 복구 하기 때문에 아무 내용이 없을때 빈값을 세팅해서 에러가 발생하지 않게 한다.
    res.render('contacts/write', { contact: ""} );
});

router.post('/write', function(req, res){
    var contact = new ContactModel({
    	title: req.body.title,
    	content: req.body.content
    });

   	contact.save(function(err){
        res.redirect('/contacts');
    });
});

router.get('/detail/:id', function(req, res) {
	// 게시물에 대한 정보 가져오기
	ContactModel.findOne( { id: req.params.id }, function(err, contact) {

		 // 해당 게시물의 코멘트 가져오기
        CommentModel.find( { contact_id: req.params.id }, function(err, comments) {
        	res.render('contacts/detail', { contact: contact , comments: comments } );
        });
	});
});

router.post('/ajax_comment/insert', function(req, res) {
	var comment = new CommentModel({
        content: req.body.content,
        contact_id: parseInt(req.body.contact_id)
    });

    comment.save(function(err, comment) {
        res.json({
            id: comment.id,
            content: comment.content,
            message: "success"
        });
    });
});

router.post('/ajax_comment/delete', function(req, res) {
	CommentModel.remove( { id: req.body.comment_id }, function(err) {
		res.json({ message: "success"});
	});
});

router.get('/edit/:id', function(req, res) {
	ContactModel.findOne( { id: req.params.id }, function(err, contact) {
		res.render('contacts/write', { contact: contact } );
	});
});

router.post('/edit/:id', function(req, res) {
	ContactModel.findOne( { id: req.params.id }, function(err, contact) {
		var query = {
            title: req.body.title,
            content: req.body.content
        };

        var contact = new ContactModel(query);
        ContactModel.update(
            { id: req.params.id },
            { $set: query }, function(err) {
                res.redirect('/contacts/detail/' + req.params.id);
        });
	});
});

router.get('/delete/:id', function(req, res) {
	ContactModel.remove( 
		{ id: req.params.id }, 
		function(err) {
			res.redirect('/contacts');
		}
	);
});

module.exports = router;
