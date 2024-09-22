import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
import helper from "../util/helper";

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    type: string;
    orgname:string;
    comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: mongoose.Error, isMatch: boolean) => void) => void;


const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        orgname: { type: String, required: true },
        type: {type: String,
            enum: ["Admin", "Consumer", "Provider"],
            default: "Consumer",
            required: true

        }

    },
    { timestamps: true },
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;


function admin_init() {
    mongoose.model("User", userSchema).findOne({ type: "Admin" }, (error, result) => {
        if (error) {
            console.log("Internal server error", error);
        } else if (result) {
            console.log("We have admin");
        } else {
            new User({
                type: "Admin",
                email: "admin@gmail.com",
                password:"12345",// bcrypt.hashSync("Admin@123", 10),
                orgname: "Org3",
            }
            ).save((error, success) => {
                if (error) {
                    console.log("error", error);
                    console.log("Error in creating admin");
                }
                else {
                    console.log("Admin created successfully");
                    console.log("Admin data is==========>", success);
                }
            });
        }
    });

    mongoose.model("User", userSchema).findOne({ type: "Provider" }, (error, result) => {
        if (error) {
            console.log("Internal server error", error);
        } else if (result) {
            console.log("We have provider");
        } else {
            new User({
                type: "Provider",
                email: "ra1@yopmail.com",
                password:"12345",// bcrypt.hashSync("Admin@123", 10),
                orgname: "Org1",
            }
            ).save((error, success) => {
                if (error) {
                    console.log("error", error);
                    console.log("Error in creating provider");
                }
                else {
                    console.log("Provider created successfully");
                    console.log("Provider data is==========>", success);
                }
            });
        }
    });

    mongoose.model("User", userSchema).findOne({ type: "Consumer" }, (error, result) => {
        if (error) {
            console.log("Internal server error", error);
        } else if (result) {
            console.log("We have consumer");
        } else {
            new User({
                type: "Consumer",
                email: "ra2@yopmail.com",
                password:"12345",// bcrypt.hashSync("Admin@123", 10),
                orgname: "Org2",
            }
            ).save((error, success) => {
                if (error) {
                    console.log("error", error);
                    console.log("Error in creating consumer");
                }
                else {
                    console.log("Consumer created successfully");
                    console.log("Consumer data is==========>", success);
                }
            });
        }
    });

}
admin_init();

async function register_admin(){
    const response = await helper.registerAndGerSecret("admin@gmail.com", "Org3");
    const response2 = await helper.registerAndGerSecret("ra1@yopmail.com", "Org1");
    const response1 = await helper.registerAndGerSecret("ra2@yopmail.com", "Org2");
}
register_admin();







export const User = mongoose.model<UserDocument>("User", userSchema);


