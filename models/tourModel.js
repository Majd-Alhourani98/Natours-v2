const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      // unique is not a validator, it will produce an error but is not a validator
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal 40 characters'],
      minLength: [10, 'A tour name must have more or equal 10 characters'],
      // maxlength also works where the l is small and the same for minlength
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a price'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        // custom validator: inside the validator function the `this` keyword is only going to point to the current document when we are creating a new dcoument, and so this function

        // the price will be always undefined on update. so the value is always undefined.

        // so the `this` inside the schema only take value on creation

        validator: function (value) {
          return value < this.price;
        },
        // TO ACCESS TO THE CURRENT VALUE {VALUE}
        message: 'Discount price `{VALUE}` should be below regular price',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [Date],

    slug: String,

    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      // GeoJSON
      // type is requried field
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },

      // coordinates is requried
      coordinates: [Number],

      // optional fields
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },

        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    // guides: Array,

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // this will add `id` property to the document also
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

// Virtual Properties
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// Document middleware: works on .save() and .update()
tourSchema.pre('save', function (next) {
  // this refers to current processing document
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  // this refers to the query
  this.find({ secretTour: { $ne: true } });
  next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  // this refres to the current aggregation
  this._pipeline.unshift({
    $match: { secretTour: { $ne: true } },
  });

  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// Geospatial data that describes places on earth using longitude and latitude coordinates
