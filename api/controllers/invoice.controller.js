import recurlyClient from "../recurlyClient.js";
import recurly from "recurly"
import { fileURLToPath } from 'url';
import path from "path"
import fs from "fs"

export const listInvoices = async(req, res) => {
    const invoices = recurlyClient.listInvoices({ params: { limit: 200 } })
    const myInvoice = []

    for await (const invoice of invoices.each()) {
        console.log(invoice.number)
        myInvoice.push(invoice);
    }

    console.log(myInvoice);

    res.status(200).json(myInvoice);
}

// Get the current directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadDirectory = path.join(__dirname, '../downloads');

export const getInvoicePdf = async (req, res) => {
    const invoiceId = req.params.id;

    try {
        const invoice = await recurlyClient.getInvoicePdf(invoiceId);

        const filename = path.join(downloadDirectory, `nodeinvoice-${invoiceId}.pdf`);

        await fs.promises.writeFile(filename, invoice.data, 'binary');
        console.log('Saved Invoice PDF to', filename);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="invoice-${invoiceId}.pdf"`);

        // Send the file directly from the server to the client
        res.sendFile(filename, (err) => {
          if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Error sending file");
          } else {
            console.log("File sent successfully");

            fs.promises.unlink(filename)
                    .then(() => console.log(`Deleted ${filename} from server`))
                    .catch((deleteErr) => console.error("Error deleting file:", deleteErr));
          }
        });

        // Send success response
        // console.log(typeof invoice.data);
        // res.status(200).json(invoice.data);

        
    } catch (err) {
        if (err instanceof recurly.errors.NotFoundError) {
            console.log('Resource Not Found');
            res.status(404).send('Resource Not Found');
        } else {
            console.error('Unknown Error: ', err);
            res.status(500).send('Internal Server Error');
        }
    }
};
