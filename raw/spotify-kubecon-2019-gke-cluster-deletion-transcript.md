Chapter 1: Introduction and Context
0:000 secondshello good morning welcome to day two of koukaon I'm really excited to be here in
0:077 secondsbeautiful Barcelona and I'm grateful to the CN CF for giving me this chance to tell you about how we had Spotify like
0:1515 secondsBrian said deleted our production kubernetes clusters accidentally twice but with little to no end user impact
0:2222 secondsnow I actually just am curious raise your hand if you have accidentally deleted a production cluster just want
0:3131 secondsto get a sense cool yeah look at that elite club out there yes I see you alright
0:3838 secondsbriefly just about myself and Spotify I'm an infrastructure engineer Spotify is a music streaming company with over
0:4646 seconds100 million subscribers and over 200 million monthly active users and inside the company we have over a thousand
0:5353 secondsdevelopers that are continuously deploying code to over 10,000 virtual machines and a little bit more about on
1:011 minute, 1 secondcontexts of Spotify is compute environment that you're gonna need to understand some of the stories that I'm going to tell you
1:081 minute, 8 secondsso Spotify uses Google cloud platform and for the purposes of this talk we have two types of engineering teams that
1:161 minute, 16 secondsSpotify teams that build infrastructure and teams that use this infrastructure to build their features that you would see if you open the app and we'll call
1:241 minute, 24 secondsthe former infrastructure teams and we'll call the latter feature teams my team builds infrastructure related to
1:321 minute, 32 secondsgoogle kubernetes engine and for the purposes of this talk again we'll call my team the cluster operators and we'll call the feature teams the
1:401 minute, 40 secondscluster users so currently as Spotify we're helping all stateless back-end
1:471 minute, 47 secondsservices migrated over to gke and at the time of these incidents we were only
1:541 minute, 54 secondsrunning a subset of services and partially each on gke I'll tell you a little bit more about what that means
2:022 minutes, 2 secondslater so we have three production clusters at the time of the stories one in each of three regions us Europe and
2:102 minutes, 10 secondsAsia and we were backing up each of them one every hour story time all right so I
Chapter 2: The First Cluster Deletion
2:172 minutes, 17 secondslove stories I'm going to tell you two of them and the first one is about how I accidentally deleted this cluster and
2:262 minutes, 26 secondsthe other is about how my co-workers when trying to prevent that from ever happening again
2:332 minutes, 33 secondsthey accidentally deleted this cluster and it gets better because in the process of trying to recreate this
2:412 minutes, 41 secondscluster in Asia that happened okay so how exactly did this happen and how did
2:482 minutes, 48 secondswe prevent any end user impacts so that people could keep listening to the music that they loved so it was November 2018
2:552 minutes, 55 secondsand I wanted to test the gke feature so I create a new GK test cluster in a test
3:023 minutes, 2 secondsproject and I wanted to have the same configuration as our production clusters so I opened two browser tabs one for the
3:103 minutes, 10 secondsproduction one one for the testing one I finished my test and I wanted to delete that test cluster and I had the wrong
3:193 minutes, 19 secondstab open so I was freaking out and on slacker I remember asking my colleague
3:263 minutes, 26 secondshow do you how do you stop this is there any way to stop this I had deleted a 50 node production cluster running dozens
3:343 minutes, 34 secondsof workloads so with GK it's actually really easy to create a cluster that's what's really awesome about it you click
3:423 minutes, 42 secondsone button you get everything masters nodes you get networking all set up you get authorization unfortunately with GK
3:523 minutes, 52 secondsit's also really easy to delete an entire cluster so with one click of a button everything goes away masters nodes authorization networking
4:004 minutesand so is there a way to stop it and I learned the hard way that no there's there's just no way to stop it you just wait for it to clean up all of the
4:084 minutes, 8 secondscompute instances and then you kind of like hold your breath and hopefully nothing too bad happened you try to recreate it so let's talk about how we
4:174 minutes, 17 secondsrecreated this cluster it took us three hours and twenty five three hours and 15 minutes to restore it fix all of our
4:244 minutes, 24 secondsintegrations with it the restoration time took this long because we found bugs in our cluster
Chapter 3: Adopting Terraform
4:314 minutes, 31 secondscreation scripts that we hadn't exercised a lot our documentation was incomplete and sometimes just had
4:384 minutes, 38 secondsmistakes in it and our cluster creation process wasn't resumable so sometimes would fail halfway and we had to restart
4:474 minutes, 47 secondsfrom the very top we didn't design it to be resumable from the middle so this wasted a lot of time okay so we thought
4:564 minutes, 56 secondsabout how would we you know human mistakes happen how are we going to prevent this from happening again and we wanted to we decided to use an
5:055 minutes, 5 secondsopen-source tool for putting your infrastructure in code this was called terraform just one of the many out there
5:135 minutes, 13 secondsand basically allows you to codify your infrastructure you can write down your clusters declaratively you can version
5:205 minutes, 20 secondsit you can review changes and while trying to adopt terraform unfortunately we we accidentally deleted not one but
5:275 minutes, 27 secondstwo clusters so how did this happen this is the second story and I'll give you some context about how we configured our
5:355 minutes, 35 secondsclusters and how terraform works so you understand the details of it so we have a shared git repository where we define
5:445 minutes, 44 secondsall of our cluster level configuration and resources on for every cluster and this repository is used by both cluster
5:525 minutes, 52 secondsusers and by my team the cluster operators so it's all mixed together
5:585 minutes, 58 secondswhen we started using terraform we we realized that there was like a state file that terraform wrote to the kind of
6:086 minutes, 8 secondslike know about the state of your infrastructure but we weren't very familiar with it terraform actually uses the state file
Chapter 4: The Second Cluster Deletion
6:166 minutes, 16 secondsto decide what it's going to do so first my team when trying to get terraform and manage these clusters we created a pull
6:246 minutes, 24 secondsrequest to import the asia cluster into the state file and this state file actually effects what's going to happen
6:326 minutes, 32 secondsin production but we ran review builds that actually modified the state file during a during the
6:396 minutes, 39 secondsview bill so let's think about that we modified a global state file that affects what happens in production
6:466 minutes, 46 secondsduring a review build we didn't merge this PR yet though and then a few
6:536 minutes, 53 secondsminutes later a cluster user who knows nothing about terraform and shouldn't need to know anything about it they made a pull request to add three
7:027 minutes, 2 secondsmore users to an hour back file an existing rule binding file and they they asked us to review it and it looked very
7:107 minutes, 10 secondsinnocuous it was just three extra users on an existing game space but what was important what wasn't what was in the PR
7:187 minutes, 18 secondsor the change file it was what was missing and it was missing the definition for the Asia cluster and
7:267 minutes, 26 secondsthese two pull requests were merged out of order so that one was merged to
7:337 minutes, 33 secondsmaster first can you guess what happens next and that's what happened so terraform looked at this emerged it
7:417 minutes, 41 secondsin it's like oh I don't see the Asia cluster defined I'm just gonna this this shouldn't be here I'm just gonna get rid of it so this way we thought okay well
7:507 minutes, 50 secondsit can't you can't get any worse right we still have that unmerged PR oh and when you think that it can't get any
7:597 minutes, 59 secondsworse it can always get worse it's always like I know it's like one of those phrases like I'll do the dishes later you know it's not gonna happen so
8:078 minutes, 7 secondswe still have that emerged PR from the previous slide that declared the age of cluster so we thought okay we'll just merge that one in and it will recreate
8:158 minutes, 15 secondsit so our cluster creation script actually fails halfway because it didn't
8:248 minutes, 24 secondshave the right permissions so before we were using terraform each of us were just running a few terraform commands
8:328 minutes, 32 secondslocally and our on our work laptops with our personal GCP accounts and those personal accounts had they were owners
8:408 minutes, 40 secondsof the project so we had all the permissions we needed but now we're using a service account to run these terraform commands and they didn't have all the permissions so we gave it we
8:498 minutes, 49 secondskind of just like gave it all the permissions it needed but these actual were different permissions in terraform originally used to import the clusters
8:588 minutes, 58 secondsand when you have different permissions and you call the Google API s you get different attributes so now when
9:079 minutes, 7 secondsterraform gets a list of clusters from GCP they have different properties because it can see more and so these properties have changed depending on
9:159 minutes, 15 secondstheir permissions so we use one set of permissions to import the clusters and now we're using another set of permissions to kind of manage them and
9:259 minutes, 25 secondsnow the clusters look different to terraform so that happened because if i don't know about this cluster this must
9:329 minutes, 32 secondsbe different so at this point we have deleted 2/3 of our production clusters from the face of the earth so this was
9:429 minutes, 42 secondspretty bad thankfully didn't get any worse than this we didn't delete like all three this time but this was pretty
9:489 minutes, 48 secondsbad still ok let's talk about the impact so the developer impact one team had to
Chapter 5: Assessing the Impact
9:559 minutes, 55 secondscreate more non kerbin IDs VMs they were actually running half-and-half so they're running some other capacity on kubernetes and some on our existing just
10:0310 minutes, 3 secondsstraight-up compute so they had to create more to handle the load my team realized all the places we had
10:1010 minutes, 10 secondshard-coded the old clusters master IPS so we had to go in and like update all
10:1610 minutes, 16 secondsof those and kind of minor annoyance but everyone using coop CTL had to refresh
10:2410 minutes, 24 secondstheir cluster credentials when we recreated the clusters that had new certificates but otherwise our user support slack channel internally was
10:3310 minutes, 33 secondsquiet it was like you're really quiet and no one paged us so let's talk about the end user impact like the sky who's
10:4310 minutes, 43 secondslistening to Spotify while you know on his jog he kept running we had no reports of either cluster
Chapter 6: Strategies for Reliability
10:4910 minutes, 49 secondsdeletion affecting our end users so first a summary of how we did this and
10:5710 minutes, 57 secondswhat we did right that prevented any end user impact so from day one of doing
11:0411 minutes, 4 secondsthis complex migration we plan for failure because you know things happen things are not always going to be reliable and
11:1111 minutes, 11 secondsthere's gonna be lots of mistakes on the way and also we when we were migrating large-scale complex infrastructure we
11:2011 minutes, 20 secondsdid it gradually and this is very important because it gives you time again it gave us time to build redundancy into our systems and to give
11:2911 minutes, 29 secondsus a chance to rollback in case anything went wrong during the migration process and last but not least we have a culture
11:3811 minutes, 38 secondsof learning that's Spotify so you know we try to figure out what have we learned from this and how do we prevent
11:4611 minutes, 46 secondsthe same type of mistake from happening in the future so that we only have it once I'm gonna go into more details on each of these now so how did we plan for
11:5511 minutes, 55 secondsfailure we originally while migrating we told each team to migrate their services
12:0212 minutes, 2 secondsjust partially to kubernetes don't put 100% of it on do half and half gradually ramp up we were still building
12:1012 minutes, 10 secondsconfidence in our ability to manage these clusters and to scale them up and to test out all of our custom
12:1712 minutes, 17 secondsintegrations with it the second way that saved us the second thing that saved us was how we registered these services
12:2512 minutes, 25 secondsrunning on kubernetes and the results of these two is that the the failover to non communities instances happened as we
12:3412 minutes, 34 secondsexpected when the clusters were deleted so let me be clear these three things were not accidents but they were deliberate choices we made to make our
12:4212 minutes, 42 secondsinfrastructure more reliable and our migration process reversible and now going to go into a little more details on each of these three and how we did
Chapter 7: Best Practices for Migration
12:5012 minutes, 50 secondsthat so for the partial migration on a per service level kubernetes usage is Spotify at the time was marked as beta
12:5912 minutes, 59 secondsand what this means is that we recommended teams only migrate some but not all of each of their services
13:0713 minutes, 7 secondscapacity to kubernetes and meanwhile we were continue working on integrations reliability and managing multiple
13:1413 minutes, 14 secondsclusters at once and we actually registered our our services on kubernetes in a kind of
13:2313 minutes, 23 secondsdifferent way the non Kerber Nettie's way due to interoperable interoperability reasons so our
13:3013 minutes, 30 secondsinternals service discovery uses pot IPs it doesn't use the service at all and
13:3613 minutes, 36 secondsthis internal service discovery pulls the services endpoints and then it updates it's it's pretty much it's
13:4613 minutes, 46 secondsupdates its internal state with the pot IPS and then when it noticed that it couldn't reach a cluster our team was
13:5413 minutes, 54 secondspaged and so we would have to go and actually remove that cluster from the configuration so that that service discovery mechanism would no longer pull
14:0214 minutes, 2 secondsthat non-existent cluster anymore and then what happened was that we failed over to the non kurby Nettie's
14:0914 minutes, 9 secondsinstances so we would restart service discovery our internal service discovery system and then the pot IPS would be
14:1714 minutes, 17 secondsremoved and then downstream clients that had a list you would gradually refresh their list of backends and it would just
14:2614 minutes, 26 secondsyou know those pod IPS wood from kubernetes would go away and it would use the kind of legacy instances that
14:3414 minutes, 34 secondsweren't on kubernetes anymore and now I want to describe some of the best practices that we followed when migrating complex infrastructure to make
14:4314 minutes, 43 secondssure that we did it gradually we could always have a chance to reverse it if we needed to so number one thing to do and
14:5014 minutes, 50 secondsalso a huge part of what saved us was we backed up these clusters from day one we codify that infrastructure or started to
14:5814 minutes, 58 secondsafter the first cluster was lead 'add we started performing disaster recovery tests and we made sure that we practiced
15:0515 minutes, 5 secondsthese drills we practice these scenarios and actually ran through them so our cluster backups they were essential we
15:1415 minutes, 14 secondshad already tested restoring from these because if you have backups but you've never tested restoring from your backups
15:2215 minutes, 22 secondsI'm sorry you don't have backups right you just never tested them codifying your infrastructure so we were
15:3115 minutes, 31 secondstrying to introduce terraform gradually and it was you better than what we had even though it you know there were some hiccups along the way terraform and tools like this
15:4015 minutes, 40 secondshelp us standardize our workflow and the change management of infrastructure code we added linters and validators to make
15:4715 minutes, 47 secondssure that the configs that we're writing were correct we also added other things like adding the output of the dry run to
15:5515 minutes, 55 secondsthe comments in the pull requests so that it was very obvious what it was going to do and we use github so we can have status checks that are required to
16:0416 minutes, 4 secondspass before merging one of these status checks is that the branch must be up to date if you get a dry run based on an
16:1316 minutes, 13 secondsold master commit it's not really what's going to happen so that we turn that on so you have to do the review build again
16:1916 minutes, 19 secondsbased on the latest master of course we require approving pull request reviews and we would just immediately fail
16:2816 minutes, 28 secondsreviews if we detected certain keywords like destroy you probably don't want to destroy something we still do those
16:3616 minutes, 36 secondsdestructions of clusters manually but not not in this repository so disaster
Chapter 8: Disaster Recovery Testing
16:4316 minutes, 43 secondsrecovery tests disasters will happen whether you plan for them or not so it's always good to just plan for them we
16:5116 minutes, 51 secondsschedule them in advance and we announce widely to operators and users when we're
16:5816 minutes, 58 secondsgonna do them you also want to test different failure conditions you maybe you want to test cluster going away or
17:0617 minutes, 6 secondssomething not as catastrophic like the control plane going down or node not being able to be added or pod not being
17:1317 minutes, 13 secondsable to be scheduled and as you're going through these exercises as you do them just record each little issue you see
17:2017 minutes, 20 secondsand fix them accordingly if it's something like typos and a documentation or just some some kind of tool that
17:2817 minutes, 28 secondswasn't automated the right way and practice makes perfect so it took me three and a quarter hours to restore the
17:3617 minutes, 36 secondsfirst cluster I had deleted along with all its integrations with the help from my team and the second cluster deletion that actually lasted from 8:00 at night
17:4517 minutes, 45 secondstill 5:00 in the morning but now we can actually restore clusters that are way bigger than the ones we
17:5317 minutes, 53 secondsdeleted before in one hour so I think that's a huge improvement and most very grateful and thankful that Spotify has
Chapter 9: Culture and Future Steps
18:0118 minutes, 1 secondengineering teams have a great culture of learning not blame so I was freaking
18:0718 minutes, 7 secondsout when I deleted that cluster my team though was very supportive and you know they said things like it's better now
18:1618 minutes, 16 secondsthan never you know this would have happened anyways and Ashley said we learned so much from doing this they stopped short of like thank you for
18:2318 minutes, 23 secondsdeleting it on a Friday but you know it was still good that that happened before we got too many users on so we're all
18:2918 minutes, 29 secondshuman and we've all made mistakes what is important isn't who made the mistake but what you learned and how you can
18:3718 minutes, 37 secondsprevent making that same type of mistake in the future so to recap what prevented that end user impact we plan for failure from the very
18:4518 minutes, 45 secondsbeginning we migrated large-scale infrastructure very gradually that gave us time to build redundancy reliability
18:5218 minutes, 52 secondsand reversibility into that process and we have a culture of learning so the
18:5918 minutes, 59 secondsnext steps for us using kubernetes as Spotify I'm very happy to say that as of last Monday we kind of flipped the
19:0819 minutes, 8 secondsswitch kubernetes is available for everyone to use and it's marked as generally available at Spotify which means that we've kind of lifted that recommendation
19:1619 minutes, 16 secondsagainst running your service entirely on kubernetes we feel confident enough that you can take your mission-critical service and run it a hundred percent on
19:2419 minutes, 24 secondskubernetes and we now have - we are in the process of figuring out or have
19:3119 minutes, 31 secondsalready kind of made good progress on managing configuration around how do we distribute workloads among multiple
19:3819 minutes, 38 secondsclusters this is we have five in each region now and how do we create more redundancy for services maybe we want to deploy these services to multiple
19:4719 minutes, 47 secondsclusters within a single region so that's my talk I want to again thank the CN CF and Spotify for this opportunity I
19:5619 minutes, 56 secondswant to thank my team for all their hard work for making kubernetes a reality in production and I want to thank all of you here for attending Spotify is a great place to
20:0520 minutes, 5 secondswork if you're looking we're hiring we're also using the latest cloud native technologies to make the entire music
20:1320 minutes, 13 secondsecosystem of work better for everyone so my name is David you can find me on Twitter here thank you so much
