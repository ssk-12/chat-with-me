import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const fetchUserDetails = async (jwt: string) => {
    try {
      const response = await fetch('https://wise-basketball-34f2254001.strapiapp.com/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
  
      const userData = await response.json();
      userData.jwt = jwt;
      console.log(userData);
      return userData;
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  
  const cookieStore = await cookies()
  const jwt = cookieStore.get("jwt")

  if (!jwt) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }


  
 
  const user = await fetchUserDetails(jwt.value);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  return NextResponse.json(user)
}

