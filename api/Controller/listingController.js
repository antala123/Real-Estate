
import { Listing } from "../Model/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";



export const createlisting = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(200).json(listing);
    }
    catch (error) {
        return next(errorHandler(500, "Something went wrong user creating listing"));
    }
}

export const deletelisting = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
        return next(errorHandler(404, "Listing not found"));
    }

    if (req.user._id !== listing.userRef) {
        return next(errorHandler(401, "User Unuthorized"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing has been delete...');
    }
    catch (error) {
        next(error);
    }
}

export const updatelisting = async (req, res, next) => {
    const listingupdate = await Listing.findById(req.params.id)

    if (!listingupdate) {
        return next(errorHandler(404, "Listing not found"));
    }

    if (req.user._id !== listingupdate.userRef) {
        return next(errorHandler(401, "User Unuthorized"));
    }

    try {
        const updateListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updateListing);
    }
    catch (error) {
        next(error);
    }

}

export const getlisting = async (req, res, next) => {

    try {
        const listingget = await Listing.findById(req.params.id)

        if (!listingget) {
            return next(errorHandler(404, "Listing not found"));
        }
        res.status(200).json(listingget);
    }
    catch (error) {
        next(error);
    }

}


export const getlistingitem = async (req, res, next) => {

    try {
        const limitcard = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] }
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] }
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] }
        }

        const searchTerm = req.query.searchTerm || '';

        const sort_order = req.query.sort_order || 'createdAt';

        const order = req.query.order || 'desc';


        const listingitems = await Listing.find({
            Name: { $regex: searchTerm, $options: 'i' },
            offer, furnished, parking, type

        }).sort(
            { [sort_order]: order }
        ).limit(limitcard).skip(startIndex);


        return res.status(200).json(listingitems);
    }
    catch (error) {
        return next(errorHandler(500, `something went wrong while user sarch listing ${error}`));
    }

}
