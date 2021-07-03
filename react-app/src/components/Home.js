import React, { useState, useEffect } from "react";

import ImageService from "../services/images";

const Home = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        ImageService.getAll().then(
            (response) => {
                setContent(response.data[0].email);
            },
            (error) => {
                const message =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();

                setContent(message.message);
            }
        );
    }, []);

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>{content}</h3>
            </header>
        </div>
    );
};

export default Home;