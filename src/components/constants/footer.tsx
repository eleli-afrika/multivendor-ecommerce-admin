import { FaFacebook, FaEnvelope } from 'react-icons/fa';

import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className=" w-full relative">
            <div
                className="top-0 left-0 p-10 flex flex-wrap justify-center items-center"
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    backgroundColor: 'black',
                    color: '#9da2ad',
                    fontFamily: 'Poppins, helvetica, Arial',
                    fontSize: '15px',
                    lineHeight: '20px',
                    width: '100%',
                    minHeight: '100%',
                    borderRadius: '0',
                }}
            >
                <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 mb-4">
                    <h1 className="text-lg font-semibold mb-2 capitalize">Quick Links</h1>
                    <ul className="list-none ">
                        <li>
                            <Link to={'/'}> Home</Link>
                        </li>
                        <li>
                            <Link to={'/'}> Products</Link>
                        </li>
                        <li>
                            <Link to={'/services'}></Link>
                        </li>
                        <li>
                            <Link to={'/contact'}>Contact us</Link>
                        </li>
                    </ul>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 mb-4">
                    <h1 className="text-lg font-semibold mb-2">Payment Methods</h1>
                    <ul className="list-none">
                        <li>
                            <a href="#">M-Pesa</a>
                        </li>
                    </ul>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 mb-4">
                    <h1 className="text-lg font-semibold mb-2">Important</h1>
                    <ul className="list-none">
                        <li>
                            <Link to={'/contact'}>Support</Link>
                        </li>
                        <li>
                            <Link to={'/eleli/faq'}>FAQS</Link>
                        </li>
                        <li>
                            <Link to={'/terms_and_conditions'}>Terms and conditions</Link>
                        </li>
                        <li>
                            <Link to={'/privacy-policy'}>Privacy Policy</Link>
                        </li>
                    </ul>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 mb-4">
                    <h1 className="text-lg font-semibold mb-2">Reach Us</h1>
                    <ul className="list-none flex gap-1">
                        <li className="mb-1">
                            <IconButton
                                style={{
                                    backgroundColor: 'white',
                                    color: 'blue',
                                    padding: '0.4rem',
                                    borderRadius: '0.25rem',
                                }}
                            >
                                <Link
                                    to="https://www.facebook.com/eleli.ke.9"
                                    target="_blank"
                                    className="text-white flex items-center"
                                >
                                    <FaFacebook color="blue" />
                                </Link>
                            </IconButton>
                        </li>
                        {/* <li className="mb-1">
                            <IconButton
                                style={{
                                    backgroundColor: 'white',
                                    padding: '0.4rem',
                                    borderRadius: '0.25rem',
                                }}
                            >
                                <Link
                                    to="tel:+254706244557"
                                    className="text-white flex items-center"
                                    target="_blank"
                                >
                                    <FaPhone color="gray" />
                                </Link>
                            </IconButton>
                        </li> */}
                        <li className="mb-1">
                            <IconButton
                                style={{
                                    backgroundColor: 'white',
                                    padding: '0.4rem',
                                    borderRadius: '0.25rem',
                                }}
                            >
                                <Link
                                    to={`mailto:innovialtd@gmail.com`}
                                    target="_blank"
                                    className="text-white flex items-center"
                                >
                                    <FaEnvelope color="orange" />
                                </Link>
                            </IconButton>
                        </li>
                        {/* <li className="mb-1">
                            <IconButton
                                style={{
                                    backgroundColor: 'white',
                                    padding: '0.4rem',
                                    borderRadius: '0.25rem',
                                }}
                            >
                                <a href="#" className="text-white flex items-center">
                                    <FaYoutube color="red" />
                                </a>
                            </IconButton>
                        </li> */}
                        {/* <li className="mb-1">
                            <IconButton
                                style={{
                                    backgroundColor: 'white',
                                    padding: '0.4rem',
                                    borderRadius: '0.25rem',
                                }}
                            >
                                <Link
                                    to="https://wa.me/+254706244557/?"
                                    className="text-white flex items-center"
                                >
                                    <FaWhatsapp color="green" />
                                </Link>
                            </IconButton>
                        </li> */}
                    </ul>
                </div>

                <div style={{ borderTop: ' solid 2px #DC5F00' }} className="w-full">
                    <p className="text-center text-white py-2 mt-2">
                        © ELELI 2026 || All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
