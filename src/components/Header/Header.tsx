import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, userSlice } from "../../store/Store";

export default function Header() {
	const isAuth = useAppSelector(userSlice.selectors.isAuth);
	const userEmail = useAppSelector((state) => state.User.email);
	return (
		<>
			<nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
				<div className="container-fluid">
					<p className="navbar-brand">OUTLAY</p>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarColor02">
						<ul className="navbar-nav me-auto">
							<li className="nav-item">
								<Link className="nav-link" to='/'>Main</Link>
							</li>
							{isAuth ? (
								<>
									<li className="nav-item">
										<Link className="nav-link" to='/categories'>Categories</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link" to='/statistic'>Statistic</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link" to='/about'>About</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link" to='/user'><span className="badge bg-success">{userEmail}</span></Link>
									</li>
								</>
							) : (
								<>
									<li className="nav-item">
										<Link className="nav-link" to='/about'>About</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link" to='/signin'>SignIn</Link>
									</li>
								</>
							)}

						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}