import { getAuth, updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import {
	updateDoc,
	doc,
	collection,
	getDocs,
	query,
	where,
	deleteDoc,
	orderBy,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

function Profile() {
	const auth = getAuth();
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState(null);
	const [changeDetails, setChangeDetails] = useState(false);
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});

	const { name, email } = formData;

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, 'listings');

			const q = query(
				listingsRef,
				where('useRef', '==', auth.currentUser.uid),
				orderBy('timestamp', 'desc')
			);

			const querySnap = await getDocs(q);

			let listings = [];

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setListings(listings);
			setLoading(false);
		};

		fetchUserListings();
	}, [auth.currentUser.uid]);

	const onLogout = () => {
		auth.signOut();
		navigate('/');
	};

	const onSubmit = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				await updateProfile(auth.currentUser, {
					displayName: name,
				});
				const userRef = doc(db, 'users', auth.currentUser.uid);
				await updateDoc(userRef, {
					name,
				});
			}
		} catch (error) {
			toast.error('Could not update info', {
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: 'dark',
			});
		}
	};

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onDelete = async (listingId) => {
		if (window.confirm('Are you sure you want to delete?')) {
			await deleteDoc(doc(db, 'listings', listingId));
			const updatedListings = listings.filter(
				(listing) => listing.id !== listingId
			);
			setListings(updatedListings);
			toast.success('Your listing was deleted!');
		}
	};

	const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

	return (
		<div className='profile'>
			<header className='profileHeader'>
				<p className='pageHeader'>My Profile</p>
				<button
					type='button'
					className='logOut'
					onClick={onLogout}>
					Logout
				</button>
			</header>
			<main>
				<div className='profileDetailsHeader'>
					<p className='profileDetailsText'>Personal Details</p>
					<p
						className='changePersonalDetails'
						onClick={() => {
							changeDetails && onSubmit();
							setChangeDetails((prevState) => !prevState);
						}}>
						{changeDetails ? 'done' : 'Change'}
					</p>
				</div>
				<div className='profileCard'>
					<form>
						<input
							type='text'
							id='name'
							className={!changeDetails ? 'profileName' : 'profileNameActive'}
							disabled={!changeDetails}
							value={name}
							onChange={onChange}
						/>
						{/* if cant update email remove from functions later  */}
						<input
							type='text'
							id='email'
							className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
							disabled={!changeDetails}
							value={email}
							onChange={onChange}
						/>
					</form>
				</div>
				<Link
					to='/create-listing'
					className='createListing'>
					<img
						src={homeIcon}
						alt='home'
					/>
					<p>Sell or rent your home</p>
					<img
						src={arrowRight}
						alt='arrow right'
					/>
				</Link>

				{!loading && listings?.length > 0 && (
					<>
						<p className='listingText'>Your Listings</p>
						<ul className='profileListings'>
							{listings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
									onDelete={() => onDelete(listing.id)}
									onEdit={() => onEdit(listing.id)}
								/>
							))}
						</ul>
					</>
				)}
			</main>
		</div>
	);
}
export default Profile;
