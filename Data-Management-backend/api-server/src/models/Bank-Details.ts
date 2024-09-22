import mongoose, { Document, Model, Schema } from "mongoose";

// {
//     "bankname": "sadasd",
//     "bankaccountnumber": "asdasd",
//     "bankaccountholdername": "asdasdasd",
//     "bankaccountifsc": "asd"
// }
// {
//     "email": "rahul",
//     "type": "Provider",
//     "orgname": "Org1"
// }
interface BankDetails {
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolderName: string;
  bankAccountIFSC: string;

  email: string;
  type: string;
  orgname: string;
}

interface BankDetailsDocument extends Document, BankDetails {}

type BankDetailsModel = Model<BankDetailsDocument>;

const bankDetailsSchema = new Schema<BankDetailsDocument, BankDetailsModel>({
  bankName: { type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  bankAccountHolderName: { type: String, required: true },
  bankAccountIFSC: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true },
  orgname: { type: String, required: true },
});

const BankDetails = mongoose.model<BankDetailsDocument, BankDetailsModel>(
  "BankDetails",
  bankDetailsSchema
);
function bank_init() {
  mongoose
    .model("BankDetails", bankDetailsSchema)
    .findOne({ type: "Provider" }, (error, result) => {
      if (error) {
        console.log("Internal server error", error);
      } else if (result) {
        console.log("Data1 already present");
      } else {
        new BankDetails({
          bankName: "HDFC",
          bankAccountNumber: "123456789",
          bankAccountHolderName: "Ra1",
          bankAccountIFSC: "HDFC0000123",
          email: "ra1@yopmail.com",
          type: "Provider",
          orgname: "Org1",
        }).save((error, success) => {
          if (error) {
            console.log("error", error);
            console.log("Error in creating data1");
          } else {
            console.log("Data1 created successfully");
            console.log("data1 is==========>", success);
          }
        });
      }
    });

  mongoose
    .model("BankDetails", bankDetailsSchema)
    .findOne({ type: "Consumer" }, (error, result) => {
      if (error) {
        console.log("Internal server error", error);
      } else if (result) {
        console.log("Data2 already present");
      } else {
        new BankDetails({
          bankName: "ICICI",
          bankAccountNumber: "987654321",
          bankAccountHolderName: "Ra2",
          bankAccountIFSC: "ICICI0000123",
          email: "ra2@yopmail.com",
          type: "Consumer",
          orgname: "Org2",
        }).save((error, success) => {
          if (error) {
            console.log("error", error);
            console.log("Error in creating data2");
          } else {
            console.log("Data2 created successfully");
            console.log("data2 is==========>", success);
          }
        });
      }
    });
}

bank_init();

export { BankDetails, BankDetailsDocument, BankDetailsModel };

// const BankDetail = new BankDetails({
//     bankName: 'ICICI',
//     bankAccountNumber: '1234567890123456',
//     bankAccountHolderName: 'ra1',
//     bankAccountIFSC: '2131231',
//     email: 'ra1@yopmail.com',
//     type: 'Provider',
//     orgname: 'Org1'
// }
// );
// BankDetail.save((error) => {
//     if (error) {
//         console.log('Internal server error', error)
//     } else {
//         console.log('BankDetails created successfully')
//     }
// })

// {
//     bankName: "HDFC",
//     bankAccountNumber: "123456789",
//     bankAccountHolderName: "Rahul",
//     bankAccountIFSC: "HDFC0000123",
//     email: "ra1@yopmail.com",
//     type: "Provider",
//     orgname: "Org1"
// },
// {
//     bankName: "ICICI",
//     bankAccountNumber: "987654321",
//     bankAccountHolderName: "Rahul",
//     bankAccountIFSC: "ICICI0000123",
//     email: "ra2@yopmail.com",
//     type: "Consumer",
//     orgname: "Org2"
// }
