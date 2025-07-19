const Listing = require("../models/listing");

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

module.exports.createListing = async (req, res, next) => {
	let url = req.file.path;
	let filename = req.file.path;

	const newListing = new Listing(req.body.listing);
	newListing.owner = req.user._id;
	newListing.image = {url , filename};
	await newListing.save();

	req.flash("success", "Successfully created a new listing!");
	res.redirect("/listings");
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

