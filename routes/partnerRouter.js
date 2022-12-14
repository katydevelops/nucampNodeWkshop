const express = require("express");
const partnerRouter = express.Router();
const authenticate = require("../authenticate");

const Partner = require("../models/partner");

partnerRouter
	.route("/")
	.get((req, res, next) => {
		Partner.find()
			.then((partners) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(partners);
			})
			.catch((err) => next(err));
	})
	.post(authenticate.verifyUser, (req, res, next) => {
		Partner.create(req.body)
			.then((partner) => {
				res.status(200).json(partner);
			})
			.catch((err) => next(err));
	})
	.put(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			res.statusCode = 403;
			res.end("PUT operation not supported on /partners");
		}
	)
	.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		Partner.deleteMany()
			.then((partners) => res.status(200).json(partners))
			.catch((err) => next(err));
	});

partnerRouter
	.route("/:partnerId")
	.get((req, res, next) => {
		Partner.findById(req.params.partnerId)
			.then((partner) => res.status(200).json(partner))
			.catch((err) => next(err));
	})
	.post(authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end(`POST operation not supported on /partner/:partnerId`);
	})
	.put(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Partner.findByIdAndUpdate(
				req.params.partnerId,
				{
					$set: req.body,
				},
				{ new: true }
			)
				.then((partner) => res.status(200).json(partner))
				.catch((err) => next(err));
		}
	)
	.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		Partner.findByIdAndDelete(req.params.partnerId)
			.then((partner) => res.status(200).json(partner))
			.catch((err) => next(err));
	});

module.exports = partnerRouter;
