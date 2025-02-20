/**
 * Utility function to convert a string to a DataView
 * @param value - The string to convert
 * @returns DataView representation of the string
 */
const textToDataView = (value: string): DataView => {
		const newValue = value.split('').map((s) => s.charCodeAt(0));
		return new DataView(Uint8Array.from(newValue).buffer);
};

const formattedDate=()=>{
	const date = new Date();

	const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${day} ${month} ${year}, ${hours}:${minutes}`;
	}

/**
 * Interface for the receipt details
 */
interface ReceiptDetails {
	shopName: string;
	guestName: string;
	selectedProducts: { name: string; quantity: number; price: number }[];
	cashierName: string;
	discount:string;
	paid:string;
	paymentMethod:string|undefined;
}

interface PrinterSetting{
	name:string;
	service:string;
	characteristics:string;
}

const definedPrinter:PrinterSetting={
	name:"RPP02N",
	service:"e7810a71-73ae-499d-8c15-faa9aef0c3f2",
	characteristics:"bef8d6c9-9c21-4c9e-b632-bd58c1009f9f"
}

/**
 * PrinterService class for managing Bluetooth printer connection and printing
 */
class PrinterService {
	private device: BluetoothDevice | null = null;
	private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
	private service: BluetoothRemoteGATTService | null = null;

	/**
	 * Connects to the Bluetooth printer
	 * @throws Error if connection fails
	 */
	async connect(): Promise<void> {
		try {
			this.device = await navigator.bluetooth.requestDevice({
				filters: [
					{ namePrefix: definedPrinter.name },
					{ services: [definedPrinter.service]}
				]
			});

			this.device?.addEventListener('gattserverdisconnected', this.onDisconnected);

			console.log('Device selected:', this.device);

			// Connect to GATT server
			const server = await this.device?.gatt?.connect();
			if (!server) throw new Error('Failed to connect to GATT server.');

			console.log('Connected to GATT server:', server);

			// Get the desired service and characteristic
			this.service = await server.getPrimaryService(definedPrinter.service); // Replace with your printer's service UUID
			this.characteristic = await this.service.getCharacteristic(definedPrinter.characteristics); // Replace with your printer's characteristic UUID

			console.log('Connected to service and characteristic');
			} catch (error) {
				console.error('Error during connection:', error);
				throw new Error('Failed to connect to the printer.');
			}
		}

	async onDisconnected(event: any) {
		console.log(event);
		const devices =  await navigator.bluetooth.getDevices();

		if(devices.filter(name=>name.name=="RPP02N").length==0){
			// Request the device
			this.device = await navigator.bluetooth.requestDevice({
				filters: [
					{ namePrefix: 'RPP02N' },
					{ services: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2']}
				]
			});
		}
		else{
			this.device = devices.find(name=>name.name=="RPP02N") || null;
		}

		// Connect to GATT server
		const server = await this.device?.gatt?.connect();
		if (!server) throw new Error('Failed to connect to GATT server.');
	}

	/**
	 * Prints a receipt using the connected printer
	 * @param details - The receipt details
	 * @throws Error if printing fails
	 */
	async printReceipt(details: ReceiptDetails): Promise<void> {
    if (!this.characteristic) {
        throw new Error('Printer is not connected.');
    }

    const { shopName, selectedProducts, cashierName, discount, paid, paymentMethod } = details;

    const boldOn = new Uint8Array([27, 69, 1]);
    const boldOff = new Uint8Array([27, 69, 0]);
    const left = new Uint8Array([27, 97, 0]);
    const center = new Uint8Array([27, 97, 1]);
    const cutter = new Uint8Array([29, 86, 0]);
    const lineFeed = new Uint8Array([10]);
    const underLine = textToDataView('='.repeat(48));
		const newEmptyLine = textToDataView(' '.repeat(48));
    const currentDate = formattedDate(); // Ensure formattedDate returns the desired format (DD Month YYYY, HH:MM)

    try {
        // Header: Shop Name
        await this.characteristic.writeValue(new DataView(center.buffer));
        await this.characteristic.writeValue(new DataView(boldOn.buffer));
        await this.characteristic.writeValue(textToDataView(`${shopName}\n\n`));
        await this.characteristic.writeValue(new DataView(boldOff.buffer));

        // Date
        await this.characteristic.writeValue(textToDataView(`${currentDate}\n`));
        await this.characteristic.writeValue(new DataView(lineFeed.buffer));
        await this.characteristic.writeValue(underLine);

        // Product Details
        let total = 0;
        for (const product of selectedProducts) {
						const productLine = `${product.quantity} x ${product.price.toLocaleString('id-ID')}`;
            const productTotal = (product.quantity * product.price);
            await this.characteristic.writeValue(new DataView(left.buffer));
            await this.characteristic.writeValue(textToDataView(`${product.name}\n`));
            await this.characteristic.writeValue(textToDataView(`${productLine}`.padEnd(38, '.') + `Rp ${productTotal.toLocaleString('id-ID')}\n`));
            total += product.quantity * product.price;
        }
        await this.characteristic.writeValue(underLine);

        // Totals
        const discountValue = total * (Number(discount) / 100);
        const grandTotal = total - discountValue;
        await this.characteristic.writeValue(new DataView(left.buffer));
        await this.characteristic.writeValue(textToDataView(`Total`.padEnd(38) + `Rp ${total.toLocaleString('id-ID')}\n`));
        await this.characteristic.writeValue(textToDataView(`Disc ${discount}%`.padEnd(38) + `Rp ${discountValue.toLocaleString('id-ID')}\n`));
        await this.characteristic.writeValue(textToDataView(`Gr. Total`.padEnd(38) + `Rp ${grandTotal.toLocaleString('id-ID')}\n`));
				await this.characteristic.writeValue(textToDataView(`Pembayaran ${paymentMethod}\n`));
        await this.characteristic.writeValue(new DataView(lineFeed.buffer));

        // Payment Status
        const paymentStatus = paid;
        await this.characteristic.writeValue(new DataView(center.buffer));
        await this.characteristic.writeValue(textToDataView(`${paymentStatus}\n\n`));

        // Footer: Cashier Name
        await this.characteristic.writeValue(new DataView(left.buffer));
        await this.characteristic.writeValue(textToDataView(`Kasir : ${cashierName}\n\n`));
        await this.characteristic.writeValue(new DataView(center.buffer));
        await this.characteristic.writeValue(textToDataView(`Sober & Chill\n~~~~~~~~~~~~~~~~~\n`));
        await this.characteristic.writeValue(newEmptyLine);
				await this.characteristic.writeValue(new DataView(lineFeed.buffer));
				await this.characteristic.writeValue(newEmptyLine);
				await this.characteristic.writeValue(newEmptyLine);
				await this.characteristic.writeValue(newEmptyLine);
				await this.characteristic.writeValue(cutter);
        await this.characteristic.writeValue(new DataView(lineFeed.buffer));

        console.log('Receipt printed successfully!');
    } catch (error) {
        console.error('Error during printing:', error);
        throw new Error('Failed to print the receipt.');
    }
}

}

export default PrinterService;

