*{
	margin: 0px;
	box-sizing:border-box;
	font-family: arial;
}
.type, .partySprite, .person{
	height: 100%;
}
:root {
	--borderColor: #808080;
	/*--borderColor: #FCF6DC;*/
}

#loading{
	position: absolute;
	width: 100vw;
	height: 100vh;
	z-index: 1;
	text-align: center;
	font-size: 100px;
	background-color: gray;
	padding-top: 15%;
	display: none;
}

#bg{
	height: 100vh;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}

#left{
	width: 1100px;
	height: 100vh;
	float: left;
}

#battleScreen{
	width: 100%;
	height: 70%;
	float: left;
	border: 2px solid var(--borderColor);
}

.sidebar{
	width: 15%;
	height: 100%;
	float: left;
	background-color: rgb(32, 31, 36, 0.8);
}
	.knownIcon{
		width: 100%;
		height: 14%;
		text-align: center;
		background-image: url("assets/icons/default_bg.png");	
		background-position: center;
		background-repeat: no-repeat;
	}
	.knownIcon:hover{
		
	}
	.fainted{
		filter: grayscale(100%);
	}
	.active{
		background-image: url("assets/icons/selected_bg.png");
	}
	.switchable:hover{		
		cursor: pointer;
		background-image: url("assets/icons/selected_bg.png");
	}
	.unknownIcon{
		width: 100%;
		height: 14%;
		text-align: center;
		background-image: url("assets/icons/unknown.png");	
		background-position: center;
		background-repeat: no-repeat;
	}
	.trainerIcon{
		width: 100;
		height: 16%;
		text-align: center;
		background-color:  #292A2F;
	}
	#playerTrainer{
		border-right: 2px solid var(--borderColor);
		border-top: 2px solid var(--borderColor);
	}
	#enemyTrainer{
		border-left: 2px solid var(--borderColor);
		border-bottom: 2px solid var(--borderColor);

	}
	


.main{
	width: 70%;
	height: 100%;
	float: left;	
	background-color: rgb(102, 102, 110, 0.3);
}
	.card{
		width: 67%;
		height: 23%;
		float: left;
		background-color: #2C2C2A;
		border-radius: 28px;
		margin-top: 6%;
		margin-left: 2%;
		padding: 10px;
		color: #E4E2C3;
	}
	#pcard{
		margin-right: 2%;
	}
		#cardbreak{
			margin-top: 5px;
		}
		.cardtop{			
			width: 100%;	
			height: 30%;
		}
			.cardName{
				font-size: 32px;
				font-weight: bold;
				height: 100%;
				float: left;
			}
			.level{
				float: left;
				margin-left: 10px;
				margin-top: 10px;
				mrgin-right: 7px;
				font-size: 18px;
			}
			.status{
				float: left;
				margin-left: 7px;
				margin-top: 2px;
				border-radius: 8px;
			}
			.cardtypes{
				height: 100%;				
				float:  right;

			}
				.cardtypeicons{
					margin-left: 11.5px;
					margin-right: 11.5px;
				}
		.cardmiddle{
			height: 15%;
			width: 100%;
			margin-top: 4px;
			margin-bottom: 4px;
			background-color: #31D680;
			border-radius: 6px;
		}
		.cardbottom{
			height: 45%;
			width: 100%;	
		}
			.statbreak{
				margin-top: 2px;
				margin-bottom: 3px;
			}
			.statChange{
				height: 100%;
				width: 11.4%;
				float: left;
				margin: 1.5px;
				border-radius: 10px;
				text-align: center;
				background-color: #1E1D23;
				color: #E4E2C3;
				padding: 3px;
			}
			.hpBox{
				width: 15%;
			}
			.stat{
				margin-top: 7px;
			}
		
	.pokemon{
		width: 29%;
		height: 29%;
		margin-top: 3.5%;
		text-align: center;
		float: left;	
	}
	.sprite{
		height: 100%;
	}
	
		#oppMon{		
			float: right;
		}

	.blank{
		height: 30%;
		clear: left;
	}


#info{
	width: 100%;
	height: 30%;
	float:  left;
	border-right: 2px solid var(--borderColor);
	border-bottom: 2px solid var(--borderColor);
	border-left: 2px solid var(--borderColor);
	background-color: rgb(72, 73, 71, 0.8);
}
	#buttBox{
		height: 25%;
		margin: auto;
		margin-top: 2%;
	}
		.move{
			color: #E1DBC4;
			width: 22.5%;
			height: 50px;
			font-size: 23px;
			font-family: arial;
			font-weight: ;
			margin-left: 1.7%;
			display: inline-block;
			background-color: #2C2C2A;
			border-radius: 28px;
			padding-left: 14px;
		}
		.move:hover{
			color: #2C2C2A;
			background-color: #D0CCB3;
			cursor: pointer;
		}
		#moveText{
			padding-top: 12px;
			display: inline-block;
		}

		#moveType{
			float: right;
		}
	#bottomLog{
		margin: auto;
		width: 96.5%;
		height: 60%;
		border-radius: 10px;
		background-color: rgb(32, 42, 52, 0.9)
	}


#right{
	height: 100vh;
	overflow: hidden;
	padding: 20px;
	border-top: 2px solid var(--borderColor);
	border-right: 2px solid var(--borderColor);
	border-bottom: 2px solid var(--borderColor);
	background-color: rgb(72, 73, 71, 0.7);
}
#sideLog{
	width: 100%;
	height: 100%;
	overflow: auto;
	border-radius: 10px;
	padding: 20px;
	border: 2px solid var(--borderColor);
	background-color: rgb(32, 42, 52, 0.9);
	color: #FCFADF;
}
.log{
	border-radius: 10px;
	padding: 20px;
	border: 2px solid var(--borderColor);
	background-color: rgb(32, 42, 52, 0.9);
	color: #FCFADF;
	font-size: 20px;
}