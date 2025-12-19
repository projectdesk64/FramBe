// Demo state for the "Golden Thread" story
export const SHARED_ORDER = {
    id: "ORD-LIVE-001",
    product: "Hydroponic Red Tomatoes (Farm Fresh)",
    quantity: "50 kg",
    stock: "500 kg", // Visible to Farmer
    buyer: "Sai PG Stays, Indiranagar",
    value: "₹2,100",
    date: new Date().toISOString().split('T')[0], // Today's date
    status: {
        farmer: "Pending Dispatch",
        middleman: "Action Required",
        pg: "Processing"
    },
    action: {
        farmer: "View Details",
        middleman: "Assign Driver",
        pg: "Track Status"
    }
};
