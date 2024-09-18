const mongoose = require('mongoose');
const slugify = require('slugify');

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

    priceDiscount: Number,

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

// Document middleware
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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// tourSchema.post('save', function (doc, next) {
//   // doc, refers to saved document
//   console.log('DOC 🔥', doc.constructor);
//   // this also refer to the current document saved
//   console.log('this 🔥', this.constructor);
// });

// we can have multiple middleware for the same hook

// Document Middleware: runs before .save() and .create() not on insertMany

// tourSchema.pre('save', function (next) {
//   // this refers to current processing document and that is why we call it document middleware
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// Query Middleware allows us to run functions before or after a certain query is executed
// - inside the query middleware the this keyword point to current query

// in mongoose we do not use arrow function becuase it does not have its own scope

/*
 this only works on .find() not on .findOne()
tourSchema.pre('find', function (next) {
  
  next();
}); */

/*
 this only works on findOne()
tourSchema.pre('findOne', function (next) {
  
  next();
}); */

// to modify the query middleware to make it works on find and findOne. we use regex to match any query starts with find
/*

tourSchema.pre(/^find/, function (next) {
  
  next();
}); */

// when you a default value field in mongoose and this field does not exist in the document, mongoose will add it to the documents when we retirive those document with the default value

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(docs); // all retrived documents
//   console.log(this); // point to the query
//   next();
// });

// tourSchema.post('aggregate', function (result, next) {
//   console.log('aggregate');
//   console.log(result); // return the result
//   console.log(this);
//   next();
// });

// data validation means bascially checking if the entered  valus are in the right format for each field
// Data sanitization: ensures that the inputted data is basically clean, so that there is no malicious code being injected into our database.
