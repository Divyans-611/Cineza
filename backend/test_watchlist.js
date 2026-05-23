const BASE_AUTH_URL = 'http://localhost:5000/api/auth'
const WATCHLIST_URL = 'http://localhost:5000/api/watchlist'

async function runTests() {
  console.log('--- Cineza Watchlist API Tests ---')

  try {
    // 1. Register a test user
    const rand = Math.floor(Math.random() * 10000)
    const testUser = {
      name: 'Watchlist Tester',
      username: `wl_tester_${rand}`,
      email: `wl_tester_${rand}@cineza.com`,
      password: 'securepassword123',
    }

    console.log('\n[TEST 1] Registering a new user...')
    const regRes = await fetch(`${BASE_AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    })
    const regData = await regRes.json()
    console.log(`Status: ${regRes.status}, Response:`, regData.success ? 'Success' : regData)

    if (!regData.success) {
      throw new Error('Registration failed')
    }

    const { token } = regData
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }

    // 2. Add movie to watchlist
    const movieData = {
      movieId: 157336,
      title: "Interstellar",
      posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdropPath: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
      releaseDate: "2014-11-05",
      rating: 8.4,
      overview: "The adventures of a group of explorers...",
      genres: ["Adventure", "Drama", "Sci-Fi"]
    }

    console.log('\n[TEST 2] Adding movie to watchlist...')
    const addRes = await fetch(WATCHLIST_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(movieData),
    })
    const addData = await addRes.json()
    console.log(`Status: ${addRes.status}, Response:`, addData)

    // 3. Add same movie again (expect 409)
    console.log('\n[TEST 3] Attempting duplicate movie add...')
    const dupRes = await fetch(WATCHLIST_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(movieData),
    })
    const dupData = await dupRes.json()
    console.log(`Status: ${dupRes.status}, Response:`, dupData)

    // 4. Get watchlist
    console.log('\n[TEST 4] Fetching watchlist...')
    const getRes = await fetch(WATCHLIST_URL, {
      method: 'GET',
      headers,
    })
    const getData = await getRes.json()
    console.log(`Status: ${getRes.status}, Response count:`, getData.count)

    // 5. Check if movie is in watchlist
    console.log('\n[TEST 5] Checking if movie is in watchlist...')
    const checkRes = await fetch(`${WATCHLIST_URL}/check/${movieData.movieId}`, {
      method: 'GET',
      headers,
    })
    const checkData = await checkRes.json()
    console.log(`Status: ${checkRes.status}, Response:`, checkData)

    // 6. Check a random movie (expect false)
    console.log('\n[TEST 6] Checking if random movie is in watchlist...')
    const randomCheckRes = await fetch(`${WATCHLIST_URL}/check/999999`, {
      method: 'GET',
      headers,
    })
    const randomCheckData = await randomCheckRes.json()
    console.log(`Status: ${randomCheckRes.status}, Response:`, randomCheckData)

    // 7. Remove movie from watchlist
    console.log('\n[TEST 7] Removing movie from watchlist...')
    const removeRes = await fetch(`${WATCHLIST_URL}/${movieData.movieId}`, {
      method: 'DELETE',
      headers,
    })
    const removeData = await removeRes.json()
    console.log(`Status: ${removeRes.status}, Response:`, removeData)

    // 8. Fetch watchlist again to verify removal
    console.log('\n[TEST 8] Fetching watchlist after removal...')
    const finalGetRes = await fetch(WATCHLIST_URL, {
      method: 'GET',
      headers,
    })
    const finalGetData = await finalGetRes.json()
    console.log(`Status: ${finalGetRes.status}, Response count:`, finalGetData.count)

    console.log('\n--- Watchlist API Tests Finished Successfully! ---')
  } catch (error) {
    console.error('Test execution failed:', error.message)
  }
}

runTests()
