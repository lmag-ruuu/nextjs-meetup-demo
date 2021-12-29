import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import { Fragment } from "react";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          property="og:title"
          content="Browse a list of highly active React meetups!"
          key="title"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

export async function getStaticProps() {
  //fetch datos o mirar archivos en el filesistem, retornar un objeto, siempre debo retornar un obj... es lo que haremos ahora xd
  const uri =
    "mongodb+srv://ruben:Gf0UD4JuZwp5Wtgb@cluster0.ejlc8.mongodb.net/meetups?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const meetups = [];

  try {
    await client.connect();
    const database = client.db();
    const meetupsCollection = database.collection("meetups");

    const result = await meetupsCollection.find().toArray();
    result.forEach((result) =>
      meetups.push({
        title: result.title,
        address: result.address,
        image: result.image,
        id: result._id.toString(),
      })
    );
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }

  return {
    props: {
      meetups: meetups,
      revalidate: 10, //estos son segundos para re-generar la pagina
    },
  };
}

export default HomePage;
