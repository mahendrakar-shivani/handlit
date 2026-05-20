import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getProviders } from '../../services/providersService';

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  rating: number;
  isVerified: boolean;
}

const ProvidersPage = () => {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const serviceId =
    searchParams.get("serviceId") || "";

  const [providers,setProviders] =
    useState<Provider[]>([]);

  const [search,setSearch] =
    useState("");

  const [loading,setLoading] =
    useState(true);



  useEffect(()=>{

    let cancelled=false;

    const fetchProviders=async()=>{

      setLoading(true);

      try{

        const data=
          await getProviders({

            search:
              search || undefined,

            serviceId:
              serviceId || undefined

          });

        if(!cancelled){

          setProviders(
            data.providers || []
          );

        }

      }catch(error){

        console.log(error);

      }finally{

        if(!cancelled){

          setLoading(false);

        }

      }

    };

    fetchProviders();

    return ()=>{

      cancelled=true;

    };

  },[search,serviceId]);



  return (

<div style={styles.page}>

<Navbar/>

<div style={styles.container}>

<h1 style={styles.heading}>
Service Providers
</h1>

<p style={styles.sub}>
Choose from our verified professionals
</p>


<div style={styles.filters}>

<input
style={styles.searchInput}
placeholder="Search providers..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


{loading ? (

<div style={styles.center}>
Loading providers...
</div>

) : providers.length===0 ? (

<div style={styles.center}>
No providers found
</div>

) : (

<div style={styles.grid}>

{providers.map((provider)=>(

<div
key={provider.id}
style={styles.card}
>

<div style={styles.avatar}>
{provider.name.charAt(0)}
</div>

<div style={styles.info}>

<div style={styles.nameRow}>

<h3 style={styles.name}>
{provider.name}
</h3>

{provider.isVerified && (

<span style={styles.verified}>
✓ Verified
</span>

)}

</div>

<div style={styles.rating}>

{"★".repeat(
Math.round(provider.rating)
)}

{"☆".repeat(
5-Math.round(provider.rating)
)}

<span style={styles.ratingNum}>

{provider.rating.toFixed(1)}

</span>

</div>

<p style={styles.bio}>

{provider.bio ||
"Professional provider"}

</p>

<button

style={styles.viewBtn}

onClick={()=>navigate(
`/providers/${provider.id}`
)}

>

View Profile

</button>

</div>

</div>

))}

</div>

)}

</div>

</div>

);

};


const styles:Record<string,React.CSSProperties>={

page:{
minHeight:'100vh',
backgroundColor:'#f3f4f6'
},

container:{
maxWidth:1100,
margin:'0 auto',
padding:'32px'
},

heading:{
fontSize:28,
fontWeight:700
},

sub:{
color:'#6b7280',
marginBottom:20
},

filters:{
marginBottom:20
},

searchInput:{
width:'100%',
padding:'10px',
border:'1px solid #ccc',
borderRadius:8
},

grid:{
display:'flex',
flexDirection:'column',
gap:20
},

card:{
display:'flex',
gap:20,
padding:20,
background:'#fff',
borderRadius:12
},

avatar:{
width:60,
height:60,
borderRadius:'50%',
background:'#2563eb',
color:'white',
display:'flex',
alignItems:'center',
justifyContent:'center',
fontWeight:700
},

info:{
flex:1
},

nameRow:{
display:'flex',
gap:10
},

name:{
margin:0
},

verified:{
background:'#d1fae5',
padding:'4px 8px',
borderRadius:20
},

rating:{
color:'orange'
},

ratingNum:{
color:'gray'
},

bio:{
color:'#6b7280'
},

viewBtn:{
padding:'10px 20px',
border:'none',
background:'#2563eb',
color:'white',
borderRadius:8,
cursor:'pointer'
},

center:{
textAlign:'center',
padding:50
}

};

export default ProvidersPage;