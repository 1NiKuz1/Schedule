export const argTypes = {
    title: {
        control: "text",
        table: {
            category: "Main"
        },
        description: "Title"
    },
    description: {
        control: "text",
        table: {
            category: "Main"
        },
        description: "Description"
    },
    height: {
        control: "number",
        table: {
            category: "Decoration"
        },
        description: "Height"
    },
    minHeight: {
        control: "number",
        table: {
            category: "Decoration"
        },
        description: "Minimum height"
    },
    bgColorClass: {
        control: "color",
        table: {
            category: "Decoration",
            defaultValue: {
                summary: "#8ee8dd"
            }
        },
        description: "Background color class"
    }
};
