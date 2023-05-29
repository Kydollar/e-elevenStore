export const formatter = new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

export function formatPhoneNumber(phoneNumber) {
	if (phoneNumber === undefined) {
		// Handle the case when phoneNumber is undefined
		return "";
	}

	// Remove any non-numeric characters from the phone number
	const numericPhoneNumber = phoneNumber.replace(/\D/g, "");

	// Check if the phone number starts with "62"
	const startsWithZero = numericPhoneNumber.startsWith("62");

	// Add the country code "62" if missing
	const formattedPhoneNumber = startsWithZero
		? "0" + numericPhoneNumber.substring(2)
		: "0" + numericPhoneNumber;

	// Split the numeric phone number into groups of three digits
	const formattedNumberWithSpaces = formattedPhoneNumber.replace(/(\d{4})(?=\d)/g, "$1-");

	return formattedNumberWithSpaces;
}
