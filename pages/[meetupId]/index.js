import MeetupDetail from "../../components/meetups/MeetupDetail.js";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

// import { DUMMY_MEETUPS } from "../index.js";

const url =
  "mongodb+srv://ruben:Gf0UD4JuZwp5Wtgb@cluster0.ejlc8.mongodb.net/meetups?retryWrites=true&w=majority";

const client = new MongoClient(url);

function MeetupDetails(props) {
  const item = {
    image: props.meetupData.image,
    title: props.meetupData.title,
    address: props.meetupData.address,
    description: props.meetupData.description,
  };
  return (
    <Fragment>
      <Head>
        <title>{item.title}</title>
        <meta
          name="description"
          property="og:title"
          content={item.description}
          key="title"
        />
      </Head>
      <MeetupDetail meetup={item} />
    </Fragment>
  );
}

export async function getStaticPaths() {
  let meetups = null;
  try {
    await client.connect();
    const database = client.db();
    const meetupsCollection = database.collection("meetups");
    meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }

  const params = meetups.map((meetup) => ({
    params: { meetupId: meetup._id.toString() },
  }));

  return {
    fallback: true,
    paths: params,
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  let selectedMeetup = null;
  try {
    await client.connect();
    const database = client.db();
    const meetupsCollection = database.collection("meetups");
    selectedMeetup = await meetupsCollection.findOne({
      _id: new ObjectId(meetupId),
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }

  return {
    props: {
      meetupData: {
        image: selectedMeetup.image,
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
