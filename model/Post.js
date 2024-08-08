import mongoose from "mongoose";
import { Schema } from "mongoose";

const CategoriesEnum = ['video', 'image'];
// Post Schema
const PostSchema = new Schema({
    content: String,
    title: String,
    image: [{ type: String, enum: CategoriesEnum }],
    createdAt: Date,
    updatedAt: Date,
    shareNb: Number,
    viewsNb: Number,
    author_id: { type: Schema.Types.ObjectId, ref: 'Tailleur' },
    comment_ids: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    like_ids: [{ type: Schema.Types.ObjectId, ref: 'Like' }]
});

export default mongoose.model('Post', PostSchema)

