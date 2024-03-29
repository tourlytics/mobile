// LIVE tab

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '../../components/Themed';
import { TouchableOpacity } from 'react-native';
import { IScore, IEvent, IHoles } from '../interfaces';
import * as event_data from '../../data/_65288/event.json';
import * as round_1 from '../../data/_65288/MPO/rounds/1.json';
// import * as round_2 from '../../data/_65288/MPO/rounds/2.json';
// import * as round_3 from '../../data/_65288/MPO/rounds/3.json';
// import { joinArray, toArray } from '../../assets/helpers/arrays';
import { useTailwind } from 'tailwind-rn/dist';

const Scorecard = () => {
  const [scores, setScores] = useState<IScore[]>([]);
  const [event, setEvent] = useState<any>([]);
  const [holes, setHoles] = useState<IHoles[]>([]);
  const [rounds, setRounds] = useState<any>([]);
  const tw = useTailwind();

  const collapsed_card_style = 'flex-row items-center justify-between py-1 h-9';
  const expanded_card_style = 'flex-row items-center justify-between py-1 h-9';

  const toggleCardVisibility = (index: number) => {
    setScores(
      scores.map((score, i) =>
        i === index ? { ...score, expanded: !score.expanded } : score
      )
    );
  };
  
  const fetchEvent = async (tournId?: number) => {
    // try db first
    // try {

    // } catch (error) {
    //   console.error(error);
    // }

    // try API if not in db
    try {
      // const response = await fetch(`${Config.ROUND_URL}`);
      // const json = await response.json();
      // setScores(json.data.scores);
      setEvent(event_data);
    } catch (error) {
      console.error(error);
    }
  };

  // const roundsToFetch = () => {
  //   const all_rounds: any[] = [];
  //   const all_divisions: string[] = event?.data?.Divisions.map((div: { Division: string, LatestRound: string }) => {
  //     return {
  //       division: div.Division,
  //       rounds: parseInt(div.LatestRound)
  //     }
  //   });
  // };

  const fetchScores = async (tournId?: number, division?: string, round?: number) => {
    // toArray(round_data);
    try {
      // const response = await fetch(`${Config.ROUND_URL?TournID=${tournId}&Division=${division}&Round=${round}}`);
      // const json = await response.json();
      // setScores(json.data.scores);
      const valid_scores = round_1?.data?.scores.map((player, idx) => {
        const valid_score: IScore = {
          id: idx,
          expanded: false,
          ShortName: player.ShortName,
          Name: player?.Name,
          HoleScores: player?.HoleScores,
          GrandTotal: player?.GrandTotal,
          RoundtoPar: player?.RoundtoPar,
          RunningPlace: player?.RunningPlace,
          Tied: player?.Tied,
          RoundScore: parseInt(String(player?.RoundScore)),
          Played: player?.Played
        };

        if(player?.ScoreID === null) valid_score.ScoreID = `DNF-${valid_score.ShortName}`;

        return valid_score;
      });

      setScores(valid_scores);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHoles = async () => {
    // toArray(round_data);
    try {
      // const response = await fetch(`${Config.ROUND_URL?TournID=${tournId}&Division=${division}&Round=${round}}`);
      // const json = await response.json();
      // setScores(json.data.scores);
      setHoles(round_1?.data?.holes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {  
    const fetchData = async () => {
      await fetchEvent();
      fetchScores();
      fetchHoles();
    };
    fetchData();
  }, []);

  const determineScoreColor = (score: number, par: number, parent_index: number): string => {
    const par_tw = `${ parent_index % 2 === 1 ? 'bg-[#38645c]' : 'bg-[#4e7974]'}`;
    const birdie_tw = 'bg-blue-600';
    const eagle_tw = 'bg-blue-800';
    const albatross_tw = 'bg-blue-900';
    const ace_tw = 'bg-emerald-500';
    const bogey_tw = 'bg-red-500';
    const double_bogey_tw = 'bg-red-700';
    const bigger_bogey_tw = 'bg-red-900';

    if((par - score) === 0) return par_tw;
    else if((par - score) === 1) return birdie_tw;
    
    else if(score === 1) return ace_tw;
    else if((par - score) === 2 && score !== 1) return eagle_tw;
    else if((par - score) === 3 && score !== 1) return albatross_tw;

    else if((par - score) === -1) return bogey_tw;
    else if((par - score) === -2) return double_bogey_tw;
    else if((par - score) <= -3) return bigger_bogey_tw;

    else return par_tw;
  };

  const renderHole = (score: string, index: number, parent_index: number ) => {
    return (
      <View style={tw(`flex-col ${ parent_index % 2 === 1 ? 'bg-[#38645c]' : 'bg-[#4e7974]'}`)} key={index}>
        <Text style={tw('text-xs text-center w-10 text-white')}>{index + 1}</Text>
        <Text style={tw('text-xs text-center w-10 text-white')}>{holes[index].Length}</Text>
        <Text style={tw('text-xs text-center w-10 text-white')}>{holes[index].Par}</Text>
        <View style={tw(determineScoreColor(parseInt(score), holes[index].Par, parent_index))}>
          <Text style={tw('text-sm text-center w-10')}>{score}</Text>
        </View>
      </View>
    )
  };

  const renderButton = (round: number) => {
    return <Text style={tw('p-1')}>{`R${round}`}</Text>;
  };

  const renderButtons = (current_round: number, index: number) => {
    return (
      <View style={tw('mx-1 bg-transparent')} key={index}>
        {renderButton(current_round)}
      </View>
    );
  };

  const renderScores = (score: IScore, index: number) => {
    return (
      // Score rows
      <View key={index} style={tw(`${ index % 2 === 1 ? 'bg-[#38645c]' : 'bg-[#4e7974]'}`)}>
        <TouchableOpacity activeOpacity={1} onPress={() => toggleCardVisibility(index)}
          style={!score.expanded ? tw(collapsed_card_style) : tw(expanded_card_style)}
        >
          <Text style={tw('font-bold text-xs text-white text-center w-12')}>{score?.Tied ? `T${score?.RunningPlace}` : score?.RunningPlace}</Text>
          <Text numberOfLines={1} ellipsizeMode='tail' style={tw('flex-row text-xs text-left w-32')}>{score?.Name}</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            
          </ScrollView>

          {/* Total Rd Thru */}
          <View style={tw(`flex-row justify-end flex-1 ${ index % 2 === 1 ? 'bg-[#38645c]' : 'bg-[#4e7974]'}`)}>
            <Text style={tw('font-bold text-white text-center w-12')}>{score?.GrandTotal > 500 ? 'DNF' : (score?.GrandTotal) - ((score?.RoundScore - score?.RoundtoPar) * 3)}</Text>
            <Text style={tw('font-bold text-white text-center w-12')}>{score?.GrandTotal > 500 ? 'DNF' : score?.RoundtoPar === 0 ? 'E' : score?.RoundtoPar}</Text>
            <Text style={tw('font-bold text-white text-center w-12')}>{score?.Played === 18 ? 'F' : score?.Played}</Text>
            {/* <Text style={tw('font-bold text-gray-500 text-left text-base w-12 text-center')}>{score?.GrandTotal}</Text> */}
          </View>
        </TouchableOpacity>

        {/* Expanded scores */}
        {score.expanded && (
          <View style={tw(`flex-row justify-center h-52 py-1 ${ index % 2 === 1 ? 'bg-[#38645c]' : 'bg-[#4e7974]'}`)}>
            <View style={tw(`flex-row flex-wrap justify-center ${ index % 2 === 1 ? 'bg-[#38645c]' : 'bg-[#4e7974]'}`)}>
              {score?.HoleScores?.map((score, hole) => renderHole(score, hole, index))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={tw('flex-1 p-1')}>
      {/* <View style={tw('justify-center bg-[url("../../assets/images/header.png")]')}> */}
      <View style={tw('justify-center bg-[#4e7974]')}>
        <Text style={tw('text-center text-xl')}>{event?.data?.Name}</Text>
        <Text style={tw('text-center text-lg')}>{event?.data?.DateRange}</Text>
        <Text style={tw('text-center text-lg')}>{event?.data?.LocationShort}</Text>
      </View>

      <View style={tw('flex-row justify-center bg-[#4e7974]')}>{[1, 2, 3].map(renderButtons)}</View>

      {/* Scoreboard container parent View*/}
      <View style={tw('flex-1 ')}>
        <View style={tw('flex-row items-center justify-between border-b-white border-b py-1 bg-[#38645c]')}>
          <Text style={tw('font-bold text-white text-center w-12')}>#</Text>
          <Text style={tw('font-bold text-white text-left w-32')}>Name</Text>
          {/* {[...Array(18)].map((_, i) => (
            <Text style={tw('font-bold text-sm text-gray-500 text-center w-9')} key={i}>{i + 1}</Text>
          ))} */}

          <View style={tw('flex-row justify-end flex-1 bg-[#38645c]')}>
            <Text style={tw('font-bold text-white text-center w-12')}>Total</Text>
            <Text style={tw('font-bold text-white text-center w-12')}>Rd</Text>
            <Text style={tw('font-bold text-white text-center w-12')}>Thru</Text>
          </View>
        </View>
        {scores.map(renderScores)}
      </View>
      <Text style={tw('text-xs text-white text-center my-4 pb-1')}>Data from PDGA</Text>
    </ScrollView>
  );
};

export default Scorecard;
