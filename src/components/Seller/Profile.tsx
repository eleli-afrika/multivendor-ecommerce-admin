import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { GettingUserById } from '../../Redux/slices/AuthSlice';
import { AppDispatch } from '../../Redux/store';
import { WhatsApp, Phone, Email } from '@mui/icons-material';
import { Avatar } from 'antd';
import cart from '../../assets/cart2.jpg';
import Loader from '../constants/loader';

import AdsTable from '../../components/userAdsTable';

const Profile = () => {
    const dispatch = useDispatch<AppDispatch>();
    // const { isLoading } = useSelector((state: any) => state.AllAds);
    // const Ads = products;
    const { Seller, isLoading } = useSelector((state: any) => state.auth);
    const theSeller = Seller;
    const { id } = useParams();

    // function FetchSellerProducts(id: string | undefined): any {
    //     throw new Error('Function not implemented.');
    // }

    useEffect(() => {
        dispatch(GettingUserById(id as string)).then((action) => {
            if (GettingUserById.fulfilled.match(action)) {
                console.log(theSeller);
                // dispatch(FetchSellerProducts(id));
            }
        });
    }, [dispatch, id]);

    console.log(theSeller);
    return (
        <div className=" min-h-screen px-5">
            <div className="flex flex-col ">
                <div className="  bg-yellow-300 rounded relative h-[fit-content]">
                    {isLoading && <Loader />}
                    <img src={cart} alt="" className="w-full  lg:h-[30vh]  rounded object-cover" />
                    <div className="p-5 bg-black bg-opacity-80 justify-center  border rounded-lg sm:flex md:justify-around price absolute top-0 left-0 w-full h-full">
                        {/* User Image and Join Date */}
                        <div className=" mb-4 sm:mb-0 flex flex-col justify-between">
                            <Avatar
                                src={` ${theSeller?.userimage}`}
                                className="w-24 h-24 object-cover mx-auto rounded-full"
                            />
                            <p className="text-stone-300 ">
                                <i>"Sellers tagline goes here"</i>
                            </p>
                            <div className="flex gap-3 mt-4 p-5 text-center">
                                <button className="p-2 rounded-full bg-gray-200" onClick={() => {}}>
                                    <Link
                                        to={`https://wa.me/+254${theSeller?.phone
                                            ?.toString()
                                            ?.substring(1)}?text=hello, ${theSeller?.firstName}`}
                                        target="_blank"

                                        // to=""
                                    >
                                        <WhatsApp className="text-green-500" />
                                    </Link>
                                </button>
                                {/* <button className="p-2 rounded-full bg-gray-200">
                                    <Facebook className="text-blue-500" />
                                </button> */}
                                <button className="p-2 rounded-full bg-gray-200">
                                    <Link
                                        to={`mailto:${theSeller?.email}`}
                                        className=""
                                        target="_blank"
                                    >
                                        <Email className="text-red-500" />
                                    </Link>
                                </button>
                                <button className="p-2 rounded-full bg-gray-200">
                                    <Link to={`tel:${theSeller?.phone}`} target="_blank">
                                        <Phone />
                                    </Link>
                                </button>
                            </div>
                        </div>

                        {/* User Information */}
                        <div className="flex flex-col sm:items-start sm:pl-4 text-gray-100">
                            <p className="mb-2">
                                Name:{' '}
                                <span className="capitalize font-bold text-secondary-orange">
                                    {`${theSeller?.firstname} ${theSeller?.middlename} ${theSeller?.lastname}`}
                                </span>
                            </p>
                            <p className="mb-2">
                                Email:
                                {theSeller?.email}
                            </p>
                            <p className="mb-2">
                                package:
                                {theSeller?.packagetype}
                            </p>
                            <button className="p-2 bg-green-500 text-white my-2 hover:bg-green-700 rounded-md">
                                {theSeller?.phone}
                            </button>
                        </div>
                        {/* user ads info */}
                        <div className="grid grid-cols-2 gap-4 mt-2 text-gray-300">
                            <span>Total products:</span>
                            <span>{theSeller?.noofproducts}</span>
                            <span>Total Reviews:</span>
                            <span>{theSeller?.totalviews}</span>
                            <span>Total comments:</span>
                            <span>{theSeller?.totallikes}</span>
                            <span>Date Joined:</span>
                            <span>{new Date(theSeller?.datejoined).toLocaleDateString()}</span>
                        </div>

                        {/* user contacts */}
                    </div>
                </div>

                {/* seller's ads */}
                <div>
                    {/*  table goes here*/}

                    <AdsTable userId={id} />
                </div>
            </div>
        </div>
    );
};

export default Profile;
