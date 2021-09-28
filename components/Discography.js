import MetaTags from './MetaTags';
import DiscographyHeader from "./DiscographyHeader";
import Album from "./Album"
import Link from 'next/link';
import { Switch } from '@headlessui/react'
import { Info, X, Search, Filter } from 'react-feather'
import { useContext, useEffect, useRef, useState } from 'react';

import { FilterMenuVisibilityStateContext } from './Filter/FilterMenuVisibility';
import { FilterNonparticipatingMembersStateContext } from './Filter/FilterNonparticipatingMembers'
import { FilterDuplicateTracksStateContext } from './Filter/FilterDuplicateTracks';

import Checkbox from './Checkbox';
import { FilterReleaseTypeContext, FilterUnitContext, FilterLanguageContext, FilterMemberContext } from './Filter/FilterContexts';
import FilterMenu from './Filter/FilterMenu';
import FilterControl from './Filter/FilterControl';

import UnitInformation from './UnitInformation'
import MemberInformation from './MemberInformation'

//main discography
const DISCOGRAPHY_TYPE = 1;

const Discography = ({
    hasMemberQuery,
    hasUnitQuery,
    currentMember,
    currentUnit,
    units,
    members,
    releaseTypes,
    languages,
    albums,
    songs
}) => {
    //const wrapperRef = useRef(null);

    /**
     * Set up meta context (filter menu, nonparticipating members, and duplicate tracks)
     */
    const { filterMenuVisibility, setFilterMenuVisibility } = useContext(FilterMenuVisibilityStateContext);
    /* useEffect(() => {
        document.body.classList.toggle('overflow-hidden', filterMenuVisibility);
    }, [filterMenuVisibility]); */

    const { nonparticipatingMembersFilter, setNonparticipatingMembersFilter } = useContext(FilterNonparticipatingMembersStateContext);
    const { duplicateTracksFilter, setDuplicateTracksFilter } = useContext(FilterDuplicateTracksStateContext);
    const { releaseTypeFilter } = useContext(FilterReleaseTypeContext);
    const { unitFilter } = useContext(FilterUnitContext);
    const { languageFilter } = useContext(FilterLanguageContext);
    const { memberFilter } = useContext(FilterMemberContext);

    //const { value } = useContext(FilterLanguageContext);

    //const languageFilterDefaults = useContext(FilterLanguageContext);
    //const [languageFilter, setLanguageFilter] = languageFilterDefaults;
    //const [colorValue, setcolorValue] = color;

    //const [releaseTypeFilter, setReleaseTypeFilter] = useState({});
    //const [unitFilter, setUnitFilter] = useState({});

    /**
     * Set up language filter controls
     */
    /* let languageFilterDefaults = languages.map(language => ({
        "id": language.id,
        "name": language.name,
        "filtered": false
    }));
    const [languageFilter, setLanguageFilter] = useState(languageFilterDefaults); */
    let unfilteredAlbumCount = albums.length;
    let unfilteredSongCount = songs.length;
    let filteredReleaseTypes = releaseTypeFilter.filter(releaseType => releaseType.filtered === true).map(releaseType => releaseType.id);
    let filteredUnits = unitFilter.filter(unit => unit.filtered === true).map(unit => unit.id);
    let filteredLanguages = languageFilter.filter(language => language.filtered === true).map(language => language.id);
    let filteredMembers = memberFilter.filter(member => member.filtered === true).map(member => member.id);


    /**
     * Filter songs
     */
    if (hasUnitQuery) {
        songs = songs.filter(song =>
            song.artists.filter(artist => artist.id === currentUnit.id).length > 0);
    }
    if (hasMemberQuery) {
        songs = songs.filter(song =>
            song.performing_artists.filter(performing_artist => performing_artist.member.id === currentMember.id).length > 0);
    }
    if (duplicateTracksFilter) {
        songs = songs.filter(song => song.duplicate === false);
    }
    if (filteredReleaseTypes.length > 0) {
        albums = albums.filter(album => filteredReleaseTypes.includes(album.release_type.id));
    }
    if (filteredUnits.length > 0) {
        songs = songs.filter(song => song.artists.filter(artist =>
            filteredUnits.includes(artist.unit)
        ).length > 0
        );
    }
    if (filteredLanguages.length > 0) {
        songs = songs.filter(song => filteredLanguages.every(languageId =>
            song.languages.map(language => language.id).indexOf(languageId) !== -1
        ));
    }
    if (filteredMembers.length > 0) {
        songs = songs.filter(song => filteredMembers.every(memberId =>
            song.performing_artists.map(performingArtist => performingArtist.member.id).indexOf(memberId) !== -1
        ));
    }

    /**
     * Generate miscellaneous and meta tag variables
     */
    let albumCount = albums.filter(album => songs.filter(song => song.album.id === album.id).length > 0).length;
    let songCount = songs.filter(song => albums.filter(album => album.id === song.album.id).length > 0).length;
    const metaFormattedName = (!hasUnitQuery && !hasMemberQuery) ? 'NCT '
        : (hasUnitQuery ? currentUnit.name + ' ' : '') + (hasMemberQuery ? currentMember.name + ' ' : '');
    const metaUrl = 'https://www.nctdiscography.com/' + (hasUnitQuery ? currentUnit.slug + '/' : '') + (hasMemberQuery ? currentMember.slug + '/' : '');


    return (
        <>
            <MetaTags
                hasUnitQuery={hasUnitQuery}
                hasMemberQuery={hasMemberQuery}
                metaFormattedName={metaFormattedName}
                metaUrl={metaUrl}
                albumCount={albumCount}
                songCount={songCount}
            />

            {/* <DiscographyHeader
                hasMemberQuery={hasMemberQuery}
                hasUnitQuery={hasUnitQuery}
                currentMember={currentMember}
                currentUnit={currentUnit}
                members={members}
                units={units}
                albumCount={unfilteredAlbumCount}
                songCount={unfilteredSongCount}
            /> */}

            <FilterControl
                hasUnitQuery={hasUnitQuery}
                hasMemberQuery={hasMemberQuery}
                currentUnit={currentUnit}
                currentMember={currentMember}
                units={units}
                members={members}
                releaseTypes={releaseTypes}
                albumCount={albumCount}
                songCount={songCount}
            />

            {/* <SearchMenu
                hasUnitQuery={hasUnitQuery}
                hasMemberQuery={hasMemberQuery}
                currentUnit={currentUnit}
                currentMember={currentMember}
                units={units}
                members={members}
            /> */}

            {/* <div className={`bg-gray-100 shadow-md fixed bottom-0 left-0 w-full z-30 ${!searchMenuVisibility && `translate-y-full`
                } transform transition duration-300 ease-in-out px-3 py-2`}>
                <div className="w-full mt-2 lg:mt-0 mb-4 lg:w-2/3 lg:px-3 lg:mb-2">
                    <div className="flex flex-nowrap justify-between items-center pb-1 mt-1 mb-3 border-b border-gray-400">
                        <div className="flex flex-wrap gap-x-2">
                            <h2 className="title text-2xl"><Search className="" strokeWidth={2} size={16} /> Search</h2>
                            <Link href={`/discography/`}><a className="flex items-center text-gray-500 hover:text-red-500 bg-white hover:bg-gray-200 rounded-full px-2 py-0.5 text-sm">
                                <X strokeWidth={2} size={16} />
                                <span className="text-black">NCT 127</span>
                            </a></Link>
                            {hasUnitQuery && <Link href={`/discography/${hasMemberQuery ? currentMember.slug : ''}`}><a className="flex items-center text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-0.5 text-sm">
                                <X strokeWidth={2} size={16} />
                                <span className="text-black">{currentUnit.name}</span>
                            </a></Link>}
                            {hasMemberQuery && <Link href={`/discography/${hasUnitQuery ? currentUnit.slug : ''}`}><a className="flex items-center text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-0.5 text-sm">
                                <X strokeWidth={2} size={16} />
                                <span className="text-black">{currentMember.name}</span>
                            </a></Link>}
                        </div>
                        <div className="flex flex-wrap gap-x-1 items-baseline">
                            <Switch.Group>
                                <Switch
                                    checked={searchMenuVisibility}
                                    onChange={setSearchMenuVisibility}>
                                </Switch>
                                <Switch.Label className="">
                                    <X className="cursor-pointer" strokeWidth={2} size={24} />
                                    <div style={{ height: 9999 + 'px', top: -9999 + 'px' }} className={`${searchMenuVisibility ? `absolute -left-0 h-screen w-full overflow-hidden` : `hidden`}`}>
                                    </div>
                                </Switch.Label>
                            </Switch.Group>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-1 gap-y-1 mb-3">
                        {units.map((unit) => (
                            <Link key={`unitFilter-${unit.slug}`} href={`/discography/${unit.slug}/${hasMemberQuery ? currentMember.slug : ''}`}>
                                <a className={`cursor-pointer text-sm px-2.5 py-1 rounded-full border border-${unit.primary_color} hover:text-${unit.secondary_color} hover:bg-${unit.primary_color} ${hasUnitQuery
                                    ? (currentUnit.id === unit.id ? `text-${unit.secondary_color} bg-${unit.primary_color}` : '') : ''} `}>
                                    {unit.name}</a>
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-1 gap-y-1">
                        {members.map((member) => (
                            <Link key={`memberFilter-${member.slug}`} href={`/discography${hasUnitQuery ? ('/' + currentUnit.slug) : ''}/${member.slug}`}>
                                <a className={`cursor-pointer text-sm px-2.5 py-1 rounded-full border border-nctu hover:bg-nctu ${hasMemberQuery
                                    ? (currentMember.id === member.id ? 'bg-nctu' : '') : ''} `}>
                                    {member.name}</a>
                            </Link>
                        ))}
                    </div>
                </div>
            </div> */}

            <main className={`px-2 py-1 mt-2 lg:px-10`}>
                <div className="container mx-auto px-1 py-2 lg:px-3">
                    {
                        songCount > 0
                            ? albums.map(album => {
                                return (
                                    songs.filter(song => song.album.id === album.id).length > 0
                                    && <Album
                                        key={`album-${album.id}`}
                                        hasMemberQuery={hasMemberQuery}
                                        hasUnitQuery={hasUnitQuery}
                                        currentMember={currentMember}
                                        currentUnit={currentUnit}
                                        id={album.id}
                                        title={album.title}
                                        slug={album.slug}
                                        releaseDate={album.release_date}
                                        releaseType={album.release_type}
                                        coverImage={album.cover_image}
                                        artists={album.artists}
                                        members={album.performing_artists}
                                        songs={songs.filter(song => song.album.id === album.id)}
                                        languages={album.languages}
                                        links={album.links}
                                        filteredLanguages={filteredLanguages}
                                    />
                                )
                            })
                            : <p className="text-center">No results found</p>
                    }
                </div>
            </main>
        </>
    )
}

export default Discography;