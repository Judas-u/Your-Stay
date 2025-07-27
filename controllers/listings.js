const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
	const allListings = await Listing.find({});
	res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
	res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
	const { id } = req.params;
	const listing = await Listing.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("owner");

	if (!listing) {
		req.flash("error", "Listing not found!");
		return res.redirect("/listings");
	}

	res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res) => {
	let response = await geocodingClient.forwardGeocode({
		query: req.body.listing.location,
		limit: 1,
	}).send();

	console.log(response.body.features[0].geometry);  

	if (req.file) {
		req.body.listing.image = {
			url: req.file.path,
			filename: req.file.filename
		};
	}

	const newListing = new Listing(req.body.listing);
	newListing.owner = req.user._id;

	await newListing.save();
	req.flash("success", "New listing created!");
	res.redirect(`/listings/${newListing._id}`); 
};


module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const listing = await Listing.findById(id);
	if (!listing) {
		req.flash("error", "Listing you requested does not exist!");
		return res.redirect("/listings");
	}
	res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
	const { id } = req.params;
	const listing = await Listing.findByIdAndUpdate(id, {
		...req.body.listing,
	});

	if (!listing) {
		req.flash("error", "Listing not found!");
		return res.redirect("/listings");
	}

	if (req.file) {
		let url = req.file.path;
		let filename = req.file.filename;
		listing.image = { url, filename };
		await listing.save(); // Save only if image is modified
	}

	req.flash("success", "Successfully updated listing!");
	res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing = async (req, res) => {
	const { id } = req.params;
	const listing = await Listing.findById(id);

	if (!listing) {
		req.flash("error", "Cannot delete: Listing not found!");
		return res.redirect("/listings");
	}
	await Listing.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted listing!");
	res.redirect("/listings");
};
